var open_quote_load = "“";
var open_quote_read = readFile("./break_js_encoding.txt","UTF-8")[0];

print("This script contains an open double-quote character encoded in UTF-8.");
print("The file break_js_encoding.txt contains the same character, also in");
print("UTF-8 encoding.  When Rhino is run, both of these byte-bundles should");
print("be similarly decoded into an interal Unicode representation and");
print("handled as a single character by the JS interpreter.");
print("");
print("This script forces the readFile command to assume that the quote character"); 
print("from the external file is UTF-8 encoded, and convert it accordingly.  This");
print("part appears to work correctly everywhere.");
print("");
print('The "load" command is another story, or might be, depending on your');
print("system.  All characters in source text SHOULD be converted to the");
print("internal Unicode representation when a script is loaded, if they are");
print("known to the locale under which Rhino is run.  Some systems, however,");
print("do not perform this conversion on loaded source text, even though");
print("the locale is set to a UTF-8 encoding, and even though readFile");
print("handles UTF-8 input correctly.  The shell script that invokes Rhino");
print("on this Javascript file will attempt to set the system locale to");
print("en_US.UTF-8.  If this program reports a mismatch between the");
print("characters, it means your system is one of these offenders.");
print("");
print("---------------------------------------------------------------------");
print("Anyway, here is the result: ");
if (open_quote_load == open_quote_read){
	print("  Encodings used by load and readFile are the same. Hurray.");
} else {
	print("  Encodings used by load and readFile differ.  Ouch!");
};
print("  ("+open_quote_load+") vs. ("+open_quote_read+")");
print("---------------------------------------------------------------------");
