from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, ID

# Define a schema for your MicroSims
schema = Schema(
    id=ID(stored=True, unique=True),
    title=TEXT(stored=True),
    subject=TEXT(stored=True),
    content=TEXT
)

# Create an index directory
import os
if not os.path.exists("index"):
    os.mkdir("index")

# Create the index
ix = create_in("index", schema)

# Add documents (MicroSims) to the index
writer = ix.writer()
micro_sims = [
    {"id": "1", "title": "Physics Basics", "subject": "Physics", "content": "Newton's laws of motion..."},
    {"id": "2", "title": "Chemistry 101", "subject": "Chemistry", "content": "Basics of elements and compounds..."},
    # Add more MicroSims here
]

for sim in micro_sims:
    writer.add_document(
        id=sim["id"],
        title=sim["title"],
        subject=sim["subject"],
        content=sim["content"]
    )
writer.commit()

