var configFiles = [{
  name: 'app/config.js',
  template: "./grunt_templates/config_template.js"
}];

var envVars = [{
  key: 'API_KEY',
  required: false
}];

var taskDescription  = "create config files populated with data pulled form " +
                       "process.env";

var undefinedWarning = "<%-VAR%> is undefined. Please define <%-VAR%> in " +
                       "your bash_profile or current process. example: " +
                       "export <%-VAR%>=[your <%-VAR%>]";

module.exports = function(grunt) {
  grunt.registerTask("generate_config", taskDescription, function() {
    var data = {};
    data.breakPoints = grunt.file.readJSON('./config/break-points.json');
    grunt.log.subhead('Getting config variables from environment');
    envVars.forEach(function(envVar) {

      if (envVar.required && !process.env[envVar.key]){
        grunt.fail.warn(undefinedWarning.replace(/<%-VAR%>/g, envVar.key));
      }


      if (process.env[envVar.key] !== undefined) {
        data[envVar.key] = process.env[envVar.key];
      } else if (envVar.default !== undefined) {
        data[envVar.key] = envVar.default
      } else {
        data[envVar.key] = '';
      }

      if (data[envVar.key] !== '') {
        grunt.log.ok(envVar.key + " is set to: " + data[envVar.key]);
      } else {
        grunt.log.writeln(">> ".yellow + envVar.key+" is not set.");
      }

    });

    grunt.log.subhead('Writing config files');
    configFiles.forEach(function(configFile) {
      var content;
      var path;
      path = process.cwd() + "/" + configFile.name;
      if (grunt.file.exists(path)) {
        grunt.log.ok("config file `"+configFile.name+"` already exists, skipping");
      } else {
        content = grunt.template.process(grunt.file.read(configFile.template), {data: data});
        if (grunt.file.write(path, content)) {
          grunt.log.ok("wrote file `"+configFile.name+"`");
        }
      }
    });
  });
};
