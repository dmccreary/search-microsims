from whoosh.qparser import MultifieldParser

# Search across multiple fields and filter by subject
with ix.searcher() as searcher:
    query = MultifieldParser(["title", "content"], ix.schema).parse("Basics")
    results = searcher.search(query, filter=ix.reader().term_filter("subject", "Physics"))

    for result in results:
        print(f"ID: {result['id']}, Title: {result['title']}")

