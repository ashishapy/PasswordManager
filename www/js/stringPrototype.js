String.prototype.toHex = function() {
  var buffer = forge.util.createBuffer(this.toString());
  return buffer.toHex();
}

String.prototype.toSHA1 = function() {
  var md = forge.md.sha1.create();
  md.update(this);
  return md.digest().toHex();
}