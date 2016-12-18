export default function(string){
  var hash = 0;
  var character;
  if (typeof string === 'undefined') {
    string = "";
  }
  if (typeof string !== 'string') {
    string = JSON.stringify(string);
  }
  if (string.length === 0) {
    return hash;
  }
  for (var i = 0; i < string.length; i++) {
    character = string.charCodeAt(i);
    hash = ((hash<<5)-hash)+character;
    hash = hash & hash;
  }
  return String(hash).replace(/[^\d]/g, '');
}
