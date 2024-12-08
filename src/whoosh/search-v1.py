from whoosh.qparser import QueryParser

# Open the index
ix = create_in("index", schema)

# Search for a term
with ix.searcher() as searcher:
    query = QueryParser("content", ix.schema).parse("Newton")
    results = searcher.search(query)

    for result in results:
        print(f"ID: {result['id']}, Title: {result['title']}, Subject: {result['subject']}")

