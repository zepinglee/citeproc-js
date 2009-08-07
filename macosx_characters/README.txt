The Rhino install on MacOSX does not seem to honor the system locale
settings.  The "load" command for program code does not have an
explicity means of setting the expected input encoding, and as a
result, UTF-8 characters that enter the interpreter via the "load"
command on a MacOSX system are not converted or normalized to the
internal Unicode representation, with the result that comparisons fail
when they ought not to.

Our workaround is to read characters in via the Rhino readFile command
whenever they are required for use in a test that itself is loaded
with the "load" command.  It's an awkward workaround, but until the
Rhino interpreter for MacOSX is fixed, it will get us by.
