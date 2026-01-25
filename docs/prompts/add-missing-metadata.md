# Add Missing Metadata

## Find Missing Metadata Python Program

!!! prompt
    Create a new python program that scans all of the
    directories in @/Users/dan/Documents/ws/*/docs/sims and
    if there is no metadata.json file, it will use the
    micorsim-util standardization skill to add a new
    metadata.json file to that sim directory.  Use the source
    code at @src/update-local-microsims.py for tips on how
    to scan the local file system to find the MicroSim
    directories.  If you don't see enough information in the
    MicroSim directory add a file called TODO.md that has a
    list of tasks to do to fix the MicroSim metadata later.

## Run the MicroSim Standardization Skill

!!! prompt
    For the MicroSims that had enough information, run the
    microsim-standardization skill and create the new
    metadata.json file.  Do a git pull before you add the
    metadata and checking with git add, git commit and git
    push after you create each file
