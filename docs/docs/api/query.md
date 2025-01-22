---
sidebar_position: 40
title: Metadata Queries
slug: /api/querying-metadata
---


:::warning

This page represents an API standard in active development.  Details may change in future releases.

:::


## Querying Metadata
MADI does offer the capability to query nested fields inside the metadata columns for `/documents`.

To query nested fields in a JSONB column in a PostgreSQL database using FeathersJS and Knex.js, you can leverage the flexibility of JSON path queries. This document will guide you through the process of querying nested fields within a JSONB column, using a sample schema and a curl request as examples.

### Understanding the Schema

The `documentSchema` defines a structure for documents stored in the database. One of the key features of this schema is the `metadata` field, which is a flexible JSONB object. This field can contain various nested properties, such as `type`, `authors`, `title`, etc. The following code shows the metadata object's standard (but optional) fields.


```javascript
export const documentSchema = Type.Object(
  {
    id: Type.Number(), // Unique identifier for the document
    hash: Type.String(), // Hash value of the document
    metadata: Type.Optional(Type.Object({
      authors: Type.Optional(Type.Array(Type.String())), // Authors of the paper
      title: Type.Optional(Type.String()), // The title of the source
      publicationDate: Type.Optional(Type.String()), // The date the source was published
      publisher: Type.Optional(Type.String()), // The publisher of the source
      journal: Type.Optional(Type.String()), // The journal in which the paper was published
      volume: Type.Optional(Type.String()), // The volume of the journal
      issue: Type.Optional(Type.String()), // The issue of the journal
      pages: Type.Optional(Type.String()), // The page numbers of the paper in the journal
      url: Type.Optional(Type.String()), // The URL of the source if available online
      doi: Type.Optional(Type.String()), // The DOI (Digital Object Identifier) of the source if available
      isbn: Type.Optional(Type.String()), // The ISBN (International Standard Book Number) for books
      issn: Type.Optional(Type.String()), // The ISSN (International Standard Serial Number) for journals
      keywords: Type.Optional(Type.Array(Type.String())), // Keywords related to the paper
      references: Type.Optional(Type.Array(Type.String())), // References cited in the paper
      isPeerReviewed: Type.Optional(Type.Boolean()), // Whether the paper has been peer-reviewed
      affiliation: Type.Optional(Type.String()), // Affiliation of the authors

      // Web Specific
      sourceDomain: Type.Optional(Type.String()), // domain of the source or publisher.  Included for easier filtering.
      headerImage: Type.Optional(Type.String()), // URL of the main image for the article if available
      images: Type.Optional(Type.Array(Type.String())), // Links to images referenced in the source material, if any.
 
      // MADI specific fields
      type: Type.Optional(Type.String()), // Type of the source e.g., Article, Video, Journal, etc.
      urlHash: Type.Optional(Type.String()), // The unique hash of the URL
      accessDate: Type.Optional(Type.String()), // Date the online source was accessed
      isArchived: Type.Optional(Type.Boolean()), // Whether the source has been archived
      archivedUrl: Type.Optional(Type.String()), // The URL of the archived version of the source

      // 

    },{ additionalProperties: true })),
    content: Type.Optional(Type.Union([Type.String(), Type.Null()])), // The content of the document in text format.
    parsedPath: Type.Optional(Type.Union([Type.String(), Type.Null()])), // The path to the parsed document
    uploadPath: Type.Optional(Type.Union([Type.String(), Type.Null()])), // filePath of the upload
    abstract: Type.Optional(Type.String()), // Shortened summary of the document. 
    plugin: Type.Optional(Type.String()), // The tool the created the specific chunk (if applicable)
    userId: Type.Optional(Type.Number()), // The user that created the specific chunk (if applicable)
  },
  { $id: 'Document', additionalProperties: true }
)
```


### Querying Nested JSONB Fields



### Querying Nested Objects inside JSONB array Fields

One of the challenging elements of any NoSQL solution or non-columnar data is querying arrays of unknown length. MADI provides the capability, but may not support all depths or all edge cases.  Confirm with your own data structure before requiring for a production plugin or feature.

Nested Arrays can be searched by direct pathing like [0] or [1] which compares against an array 


#### 1. Querying for Specific Values in an Array

**Pattern**: Find documents where a specific array contains a given value.
**Example**: check if metadata.user.details.list contains the string `item2`.
  - **Path**: `&user.details.list[*]=item2`
  - **SQL**: 
```sql
select * from "documents" where exists (
	select 1 from jsonb_array_elements_text(metadata->'user'->'details'->'list') AS afwirq
	where afwirq = 'item2') 
```

#### 2. Querying for Specific Value at Path

**Pattern**: Find documents where a specific path is equal to a string or numeric value.
**Example**: check if metadata.user.details.a is exactly the string `b`.
  - **Path**: `&user.details.a=b`
  - **SQL**: 
```sql
select * from "documents" where jsonb_array_elements(metadata->'user'->'details'->'a') = 'b'
```


<!-- 
any document that with user.details.list with 1+ item equal to item2
    &user.details.list[*]=item2

    WHERE 'item2' = ANY (user->'details'->'list'::jsonb_array_elements_text())

any document that with user.details.list2 with 1+ item where a=b
    &user.details.list2[*].a=b

    WHERE EXISTS (
       SELECT 1 FROM jsonb_array_elements(user->'details'->'list2') elem
       WHERE elem->>'a' = 'b'
   )

any document that with user.details.list3 with 1+ item where n contains 1
    &user.details.list3[*].n[*]=1

    WHERE EXISTS (
       SELECT 1 FROM jsonb_array_elements(user->'details'->'list3') elem
       WHERE 1 = ANY (jsonb_array_elements_text(elem->'n')::int[])
   )

any document that with user.details.list4 where the second item has a=b
    &user.details.list4[1].a=b
    &user.details.list4[1][a]=b

    WHERE user->'details'->'list4'->1->>'a' = 'b'

any document that with user.details.list6 where the array is exactly equivalent to [{a:b, c:d}]
    &user.details.list6[$eq].a=b
    &user.details.list6[$eq][c]=d

    WHERE user->'details'->'list6' = '[{"a": "b", "c": "d"}]'::jsonb

any document that with user.details.list7 where list7 is ann array with length greater than or equal to 2
    $user.details.list7[$len][$gte]=2

    WHERE jsonb_array_length(user->'details'->'list7') >= 2


any document that with user.details.list8 with at least one item where n is an array that contains at least one item where a=b
    &user.details.list8[*].n[*].a=b

   WHERE EXISTS (
       SELECT 1 FROM jsonb_array_elements(user->'details'->'list8') elem
       WHERE EXISTS (
           SELECT 1 FROM jsonb_array_elements(elem->'n') n_elem
           WHERE n_elem->>'a' = 'b'
       )
   )

### Example compound query object
const queryObject = {
    metadata:{
        user: {
            details: {
                // hobbies: { $in: ['reading', 'swimming'] },
                // list: { '*': 'item2' },
                list2: { '*': { a: 'b' } },
                // list3: { '*': { n: { '*': 1 } } },
                // list4: { 1: { a: 'b' } },
                // list6: { $eq: [{ a: 'b', c: 'd' }] },
                // list7: { $len: { $gte: 2 } },
                // list8: { '*': { n: { '*': { a: 'b' } } } }
            }
        },
        // status: 'active',
        // tags: { $in: ['sports', 'health'] },
        // items: { $nin: ['item1', 'item3'] }
    }
}; -->