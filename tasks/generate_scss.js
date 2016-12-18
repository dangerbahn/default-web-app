module.exports = function(grunt) {
  grunt.registerTask("generate_scss", "generate import paths & app.scss file", function() {
    var importPaths = [];
    grunt.file.expand({
      filter: 'isFile',
      cwd: './app/styles'
    }, ['**/*.scss']).forEach(function(file){
      if (file === "app.scss") {
        return false;
      }
      importPaths.push("@import \"./app/styles/" + file + "\";");
    });
    grunt.file.expand({
      filter: 'isFile',
      cwd: './app/components'
    }, ['**/*.scss']).forEach(function(file){
      importPaths.push("@import \"./app/components/" + file + "\";");
    });
    importPaths = importPaths.join("\n");
    var data = {};
    data.importPaths = importPaths;
    data.breakPoints = grunt.file.readJSON('./config/break-points.json');
    grunt.log.writeln("generating new app.scss...");
    var scssTemplate = grunt.template.process(grunt.file.read( "./grunt_templates/scss_template.js" ), {data: data});
    grunt.file.write("./app/styles/app.scss", scssTemplate);
  });
};
