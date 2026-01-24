# List Similar MicroSims

!!! prompt
    First of all, never read the @data/microsim-embeddings.json file directly.  It is 7MB and
    reading it directly will crash Claude Code.

    I would like to have the items of the search results have a new feature.  The main search page     
    is here: @docs/search-microsims/search/demo.html  The new feature I want a new button that         
    has a "Similar MicroSims" button for each search result item.  My hope is that you can use the     
    embeddings @data/microsims-embeddings.json to find the most similar sims for a given               
    MicroSim.  How about we create a new MicroSim to test this out.  Put list similar MicroSim app     
    in @docs/sims/list-similar-microsim/main.html.  This would take the URL ID of each MicroSim        
    as a URL parameter and then list the most similar MicroSims and provide a title and short          
    description and similar information to the existing search results page.

    ❯ I am concerned about loading a large 7MB file into the docs area.  Will this work?                 

Is there a way we can create a batch python program that will just add the IDs of the 10 most      
  similar MicroSims to a file that is read by the application? 