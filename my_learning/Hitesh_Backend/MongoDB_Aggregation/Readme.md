In mongodb database i have create one database called aggregate where there are 3 collections, users, athors and books

1. in users collection there are 3 documents
2. in authors collection there are 3 documents
3. in books collection there are more than 20 documents

# Here are some question which we perfrom aggregation in mongodb

NOTE": - Without grouping you cannot perform any operation to all the database users or all the database documents.

---

# Questions

## 1) How many users are active.?

### Ans: -

```js
db.users.aggregate([
  {
    $match: {
      isActive: true,
    },
  },
  {
    $count: "activeUsers", // here we call it whatever we want to call we call activeUser here
  },
]);
```

![image](https://github.com/user-attachments/assets/588058ce-1819-4fc2-bb3a-7c5576ed3d15)

## 2) What is the average age of all users?

### Ans: -

![image](https://github.com/user-attachments/assets/300b5d92-ea42-41a1-b61c-9ba4b7547a7d)

```js
db.users.aggregate([
  {
    $group: {        // i want to group those people based on age or gender whatever u want
      _id: "null",    // look , we can provide any field here with $ sign or if we want to group them by nothing then we can provide _id: null
      averageAgeCalculatorByMe: {
        $avg: "$age",
      },
    }
  }
  },
]);
```

```json
{
  "_id": null,
  "averageAgeCalculatorByMe": 29.835
}
```

```js
[
  {
    $group: {
      _id: "$gender",
      averageAgeCalculatorByMe: {
        $avg: "$age",
      },
    },
  },
];
```

```json
{
"_id": "male",
"averageAgeCalculatorByMe": 29.851926977687626
}
 {
"_id": "female",
"averageAgeCalculatorByMe": 29.81854043392505
}
```

![image](https://github.com/user-attachments/assets/4ba80fd7-ac10-4674-9b43-d54266b96cd8)

## 3) List the top 5 most common favorite fruits among the users..?

### Ans: -

for finding the favorite fruits i need to group them based on how many unique values of this particular field can be [favoriteFruit]

```js
[
  {
    $group: {
      _id: "$favoriteFruit",
    },
  },
];
```

```json
{
"_id": "banana"
}
{
"_id": "apple"
}
{
"_id": "strawberry"
}
```

I have grouped them together, and now I want to count.

```js
[
  {
    $group: {
      _id: "$favoriteFruit",
      countingByMe: {
        $sum: 1,
      },
    },
  },
];
```

we can actually use a $sum, and with this sum, we can provide a 1 here. This 1 simply says that the moment you found any user in the banana category, let's say just add 1 value. [or simply increase by 1]

```json
{
  "_id": "banana",
  "countingByMe": 339
}
{
  "_id": "strawberry",
  "countingByMe": 323
}
{
  "_id": "apple",
  "countingByMe": 338
}
```

Now i have to use a Sorting because our question is to find the top 5, so we make another stage

By the way, you can do sort just like this. $sort......
But , You have to provide based on what field you want to do, sort , and here is another thing.

This countingByMe field is not available in my original database. But since I am into the aggregation staging of pipeline now for this particular field or this particular pipeline, the countingByMe field does exist.

```js
[
  {
    $group: {
      _id: "$favoriteFruit",
      countingByMe: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      countingByMe: -1,
    },
  },
];
```

```json
{
  "_id": "banana",
  "countingByMe": 339
}
{
  "_id": "strawberry",
  "countingByMe": 323
}
{
  "_id": "apple",
  "countingByMe": 338
}
```

what if i do countingByMe 1 not -1 [Negative one means highest value on the top.]
just changed the order

```json
{
  "_id": "strawberry",
  "countingByMe": 323
}
{
  "_id": "apple",
  "countingByMe": 338
}
{
  "_id": "banana",
  "countingByMe": 339
}

```

I want to find out top five, top three, top one.
So I can provide one more pipeline here
**\*\*** $limit **\*\*\***

```js
[
  {
    $group: {
      _id: "$favoriteFruit",
      countingByMe: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      countingByMe: 1,
    },
  },
  {
    $limit: 2, // I only want to send you the two values of the top value.
  },
];
```

```json
{
  "_id": "strawberry",
  "countingByMe": 323
}
{
  "_id": "apple",
  "countingByMe": 338
}
{
  "_id": "banana",
  "countingByMe": 339
}

```

![image](https://github.com/user-attachments/assets/9e86162d-7956-405c-861c-8a77d15dbbff)

limit 2 [ I only want to send you the two values of the top value.]

![image](https://github.com/user-attachments/assets/c21510a2-6100-4cf3-88ed-e22cb0481ecc)

## 4) Find the total number of males and females?

```js
[
  {
    $group: {
      _id: "$gender",
      totalMaleAndFemals: {
        $sum: 1,
      },
    },
  },
];
```

```json
{
  "_id": "female",
  "totalMaleAndFemals": 507
}
{
  "_id": "male",
  "totalMaleAndFemals": 493
}
```

![image](https://github.com/user-attachments/assets/584a1866-9467-421b-80cd-7800e989c33a)

## 5) Which country has the highest number of registered users?

### Ans: -

![image](https://github.com/user-attachments/assets/dbc4f5e5-1b04-4c37-b7b6-a240b5508a31)

```js
[
  {
    $group: {
      _id: "$company.location.country",
    },
  },
];
```

But I want to count how many documents you subbed or you grouped based on France, based on USA etc. so the easiest way is to do the counting. But no, this is not counting, this is summing up, and then we will sort them

```js
[
  {
    $group: {
      _id: "$company.location.country",
      countryUserCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      countryUserCount: -1,
    },
  },
];
```

![image](https://github.com/user-attachments/assets/4f121fb8-caea-4cc7-9172-f1fd6c2d92cd)

if we want a top 3 or top 5 we use limit

```js
[
  {
    $group: {
      _id: "$company.location.country",
      countryUserCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      countryUserCount: -1,
    },
  },
  {
    $limit: 3,
  },
];
```

## 6) List all the unique eyes colors present in the collection?

### Ans: -

i am just couning diff eye color for fun purpose

```js
[
  {
    $group: {
      _id: "$eyeColor",
      countDiffEyeColor: {
        $sum: 1,
      },
    },
  },
];
```

![image](https://github.com/user-attachments/assets/367df415-1c15-42cf-a476-37c1923fe2da)

---

# Dealing with Array

## 7) What is the average number of tags per user?

anytime you see an array and you want to kind of rip apart those array, spread them around, then you go with $unwind.
So imagine that there is one user and in the array there are three elements. So what this unwind does, it creates three document for that user.
The id of the user will remain same, but the only property that will change is the array value.

### Ans: -

```js
[
  { $unwind: "$tags" },
  {
    $group: {
      _id: "$_id", // Because remember I told you, everything is duplicated. The only value that is _id is same in array value.
      numberOfTags: {
        $sum: 1,
      },
    },
  },
  {
    $group: {
      _id: null,
      averageNumberOfTags: {
        $avg: "$numberOfTags",
      },
    },
  },
];
```

![image](https://github.com/user-attachments/assets/441c49cf-1c17-448a-bd49-f8a6dd987436)

---

### Other ways to do it

---

aggregation pipeline which known as add fields which adds a new field into the existing documents.

$size just go ahead and use a size which actually tells you the size of an array.  
$size : "$$tags"
But this is MongodB. That means there could be a chance that this tag might not be present in all the documents. then how to handle it.... see
 $size: {$ifNull: ["$tags" ,[]]},
So if null, then use the square brackets in this one. And then first of all, the first parameter is where should I look for the property which is in this case, tags. But what if I found this property as null? What should I do in that case? Treat it as an empty array. That's it.

So now based on this, how can I actually calculate the average?

```js
[
  {
    $addFields: {
      numberOfTags: {
        $size: { $ifNull: ["$tags", []] },
      },
    },
  },
  {
    $group: {
      _id: "null",
      averageOfNumberOfTags: {
        $avg: "$numberOfTags",
      },
    },
  },
];
```

```json
{
  "_id": "null",
  "averageOfNumberOfTags": 3.556
}
```

## 8) How many users have 'enim' as one of thier tags?

### Ans: -

Objects are not really that much difficult to work on with because you can just access them with the dot notation. The arrays or the tags are little bit difficult to find out.

So we need to learn a little bit more of the aggregation pipeline and some of that stages to work with this one because now it's not about grouping the data. I want to have some filtration as well. So how can I use filtration in the MongoDB aggregation?
![image](https://github.com/user-attachments/assets/ffb8a51c-aabc-465f-9118-e735a0ee5dd4)

$match
Filters documents based on a specified query predicate. Matched documents are passed to the next pipeline stage.

```js
[
  {
    $match: {
      tags: "enim",
    },
  },
  {
    $count: "userWithEnimTags",
  },
];
```

```json
{
  "userWithEnimTags": 62
}
```

sum is to actually aggregate, accumulate all of that. But I just want to count all of them.
I want to use an operator known as count which counts all these values.

## 9) What are the names and age of users who are inactive and have 'velit' as a tag?

### Ans: -

$Project - Passes along the document with the requested field to the next stage in the pipeline. The specified field can be an existing field
from an input or newly computed value.
Like we want name field and age field here so , whatever the fields you want. You just want to put a 1 after that.

```js
[
  {
    $match: {
      isActive: false,
      tags: "velit",
    },
  },
  {
    $project: {
      name: 1,
      age: 1,
    },
  },
];
```

![image](https://github.com/user-attachments/assets/63464e0e-957c-4c34-829a-402cf5331045)

## 10) How many users have a phone number starting with '+1(940)?

### Ans: -

```js
[
  {
    $match: {
      "company.phone": /^\+1 \(940\) /,
    },
  },
  {
    $count: "usersWithPhone",
  },
];
```

```json
{
  "usersWithPhone": 5
}
```

## 11) who has registered the most recently?

- 1 [So negative 1 means the user who have registered in the very last will come at the very top.]

### Ans:-

```js
[
  {
    $sort: {
      registered: -1,
    },
  },
  { $limit: 3 },
  {
    $project: {
      name: 1,
      registered: 1,
      favoriteFruit: 1,
    },
  },
];
```

```json
{
  "favoriteFruit": "apple",
  "_id": {
    "$oid": "680881f16233b72c41bcdf3e"
  },
  "name": "Stephenson Griffith",
  "registered": {
    "$date": "2018-04-14T03:16:20.000Z"
  }
}
___________________________________
{
  "_id": {
    "$oid": "680881f16233b72c41bcde2f"
  },
  "name": "Sonja Galloway",
  "registered": {
    "$date": "2018-04-11T12:52:12.000Z"
  },
  "favoriteFruit": "strawberry"
}
___________________________________
{
  "_id": {
    "$oid": "680881f16233b72c41bce050"
  },
  "name": "Mcpherson Christensen",
  "registered": {
    "$date": "2018-04-11T07:18:42.000Z"
  },
  "favoriteFruit": "strawberry"
}
```

![image](https://github.com/user-attachments/assets/1e9a4cd6-aa75-4fe5-9a0e-2cef4b0ccdd8)

## 12) Categorize users by their favorite fruit?

### Ans: -

categorization, grouping them is almost same.

so ew have all of them are grouped based on favorite fruit. So we have bananas, apple and strawberries. So these are our categories of fruit now.
But we don't know how many users are there in each one of them.

$push - I can use another variable, not operator of the MongoDB where you can use actually dollar push. Again, "notice" **push is an accumulator**.
So the push operators appends a specified value to an array.

```js
[
  {
    $group: {
      _id: "$favoriteFruit",
      users: { $push: "$name" },
    },
  },
];
```

![image](https://github.com/user-attachments/assets/76948b1f-30fa-4740-a77a-38d328a1113c)

## 13) How many users have 'ad' as the second tag in their list of tags?

### Ans: - for second tag we use index method like 0 or 1 and etc...

```js
[
  {
    $match: {
      "tags.1": "ad",
    },
  },
  {
    $count: "usersHaveTagAtSecondPlace",
  },
];
```

```json
{
  "usersHaveTagAtSecondPla": 12
}
```

## 14) Find users who have both 'enim' and 'id' as thier tags?

### Ans:- $all - all operator selects the document where the value of field is an array that contains all the specified elements.

```js
[
  {
    $match: {
      tags: { $all: ["enim", "id"] },
    },
  },
];
```

we got 5 document in pipeline output

## 15) List all companies located in the USA with their corresponding user count?

### Ans:-

```js
[
  {
    $match: {
      "company.location.country": "USA",
    },
  },
  {
    $group: {
      _id: null,
      countUser: {
        $sum: 1,
      },
    },
  },
];
```

If you wish we can group them all together based on the company title

```js
[
  {
    $match: {
      "company.location.country": "USA",
    },
  },
  {
    $group: {
      _id: "$company.title", // just making little change here
      countUser: {
        $sum: 1,
      },
    },
  },
];
```

---

## $lookup (aggregation)

![image](https://github.com/user-attachments/assets/1343d660-74ac-4e92-a143-1ffb4ce4da89)

#### what is this lookup?

Now this lookup has couple of fields that you have to always provide. The first one is from, from which collection I want to look up the data. Then the second is what is the local field in the current field where you are? foreign field is where that field exactly match, because this is the matching that goes on. And finally, what do you want to call the result .

##### Lookup Aggregation in Simple Terms

Imagine you're a teacher with two separate lists:

Student List: Contains student IDs and their test scores

Student Info List: Contains student IDs and their names

You want to create a report that shows student names with their test scores, but the information is split across these two lists.Lookup aggregation is like having a helper who: Takes your main list (test scores) For each student ID, goes to the other list (student info) Finds the matching name
Combines them into one complete record

```js
db.students.aggregate([
  {
    $lookup: {
      from: "student_info", // The other collection to look up
      localField: "student_id", // Field in the main collection (scores)
      foreignField: "student_id", // Field in the other collection (info)
      as: "student_details", // Where to put the matched documents
    },
  },
  {
    $unwind: "$student_details", // Flatten the array (since lookup returns an array)
  },
  {
    $project: {
      // Shape the final output
      _id: 0, // Exclude the default _id field
      name: "$student_details.name",
      score: "$score",
      student_id: 1, // Include student_id (1 means include)
    },
  },
]);
```

```json
{
  "student_id": "S1001",
  "name": "Alice",
  "score": 95
}
{
  "student_id": "S1002",
  "name": "Bob",
  "score": 88
}
```

In our case we have authors and books so

```js
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "authors_details",
    },
  },
];
```

Output

```json
{
  "authors_details": [
    {
      "_id": 100,
      "name": "F. Scott Fitzgerald",
      "birth_year": 1896
    }
  ],
  "_id": 1,
  "title": "The Great Gatsby",
  "author_id": 100,
  "genre": "Classic"
}
... same rest of 2 document
```

we use $addFields pipeline and add a new field calling as authors_details and then we use $first so it can go through into any array and bring out
the first value,out of it.

```js
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "authors_details",
    },
  },
  {
    $addFields: {
      authors_details: {
        $first: "$authors_details",
      },
    },
  },
];
```

Output

```json
{
  "title": "The Great Gatsby",
  "author_id": 100,
  "genre": "Classic",
  "authors_details": {
    "_id": 100,
    "name": "F. Scott Fitzgerald",
    "birth_year": 1896
  },
  "_id": 1
}
... same rest of 2 document
```

---

Let's just say I don't like this structure, the syntax of first, so we can use another elaborative option which is known as array element at.

In this one you can specifically mention from the array which element at which position I want to bring that in.

```js
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "authors_details",
    },
  },
  {
    $addFields: {
      authors_details: {
        $arrayElemAt: ["$authors_details", 0],
      },
    },
  },
];
```

### Does the same job as we have seen, but you will find that this array element is being used quite a lot in the production because it makes code much more readable, understandable. But fundamentally there is no difference when you use something as first or when you use array element at.

---

Simple other way to get data

```js
db.books.aggregate([
  {
    $lookup: {
      from: "authors", // The collection to look up
      localField: "author_id", // Field in books collection
      foreignField: "_id", // Field in authors collection
      as: "author_details", // Where to store the matched author info
    },
  },
  {
    $unwind: "$author_details", // Convert the array to an object
  },
  {
    $project: {
      // Shape the final output
      title: 1,
      genre: 1,
      author_name: "$author_details.name",
      author_birth_year: "$author_details.birth_year",
    },
  },
]);
```

What This Pipeline Does:

1. $lookup:

- Takes each book document
- Finds the author in the "authors" collection where author_id (book) matches \_id (author)
- Stores the matching author info in "author_details" array

2. $unwind:

- Converts the single-item "author_details" array into a direct object

3. $project:

- Creates the final output with:
- Book title and genre
- Author name (pulled from the looked-up data)
- Author birth year (pulled from the looked-up data)

##### Sample Output

```json
{
  "title": "The Great Gatsby",
  "genre": "Classic",
  "author_name": "F. Scott Fitzgerald",
  "author_birth_year": 1896
},
{
  "title": "Nineteen Eighty-Four",
  "genre": "Dystopian",
  "author_name": "George Orwell",
  "author_birth_year": 1903
}
// ... and so on for other books
```
