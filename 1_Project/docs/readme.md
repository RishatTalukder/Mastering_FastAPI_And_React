# Introduction to FastAPI with TODOs

Well this is a todo app with `FastAPI + React`! That's it.

But first let's setup the project.

# FastApi installation

We need `python`. Any version higher than 3.9 should work.

If you are in `windows` or `mac` you can download it [here](https://www.python.org/downloads/).

If you are in `linux` you should have it already installed.

Always remember to check the version of `python` you have installed.

```bash
python --version
```

I'll be using `python 3.12.2` for this project.

Now, we need to do some work.

Make a directory with a name of your choice. I named it `1_Project`. Now open it in a code editor of your choice.

Open a terminal(cmd) and navigate to the directory you just created.

And now we are going to make a virtual environment.

What is a virtual environment, you ask?

A `Virtual Environment` is a separate folder that contains all the dependencies of your project. It is a isolated python environment where you can install all the dependencies of your project without effecting your system.

I hope you navigated to the directory you just created. Now, run this command

```bash
python -m venv env
```

This will create a virtual environment named `env` in the current directory.

Now, we need to activate the virtual environment to use it.

```bash
# for windows
.\env\Scripts\activate

# for linux or mac
source env/bin/activate
```

And now, with the virtual environment activated, you can check the version of `python` in the environment.

```bash
python --version
```

To deactivate the virtual environment, run this command,

```bash
deactivate
```

You should see the same version of `python` you have installed.

But this is a completely clean and separate environment.

Ans now we can move on to the next step.

### Installation

Make sure your environment is activated.

And let's install `fastapi`.

```bash
pip install "fastapi[standard]"
```

Now, inside the directory, create a file named `main.py` and add the following code,

```python {.line-numbers}
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
```

This is a basic `FastAPI` app. I'll go over the code in one second but first let's run the app.

Open the terminal again and run the following command,

```bash
fastapi dev main.py
```

This will start the server and you should see some interesting outputs in the terminal.

But most improtant is the address of the server.
![alt text](image.png)

Hover over the address and click on the `ctrl` button and left mouse click on the address this should open the address in you default browser automatically.

And you'll see something like this,

![alt text](image-1.png)

Have we seen this before? > {"message":"Hello World"}

Take a look at the code, in the very last line of the code, we have `return {"message": "Hello World"}`.

So, let's Go line by line.

## Starting the app

In the `main.py` file, we start with the following code.

```python {.line-numbers}
from fastapi import FastAPI

app = FastAPI()
```

The first line imports the `FastAPI` class from the `fastapi` module.

and then we have to specify the `app` variable that initializes the `FastAPI` class.

This will tell make the whole file the starting point of our app.

Then we can straight away make an `api endpoint`,

```python {.line-numbers}

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

The structure of the code is,

```python {.line-numbers}

@app.get("/some_route")
async def some_function():
    #endpoint logic
    return # a dictionary or object
```

`@app.get("/some_route")` is a decorator that makes a backend API endpoint with same name as passed in the decorator.

When you go to that endpoint the function below it will be executed and it will return a dictionary or an object.

> Remember, a endpoint function must return a dictionary or an object.

Now, the path "/" represents the home page of our app. So, whenever you enter the address of the server, you should see the message "Hello World".

One last thing before we go into other topics.

If you take a close look at the code, you'll see that the function is `async`.

If you remove the `async` keyword, the app will work the same as before but it will not be `asynchronous`.

I'll talk more about asynchronous programming later. In the mean time, you can take a look at this [link](https://www.datacamp.com/tutorial/python-async-programming) to learn more about asynchronous programming.

# The project

As we have a project using react and fastapi, we should structure it nicely because we don't want to work in a mess.

So, I'll make two folders inside the `1_Project` folder. 1. Frontend 2. Backend.

I'll move the `main.py` and the `env` directory into the backend folder.

Now, all we have to do is `cd` into `backend` directoy and run the `fastapi run main.py` command.

## features of FastAPI

`FastAPI` is a modern, fast (high-performance), web framework for building APIs.

As we will be building a todo app, we will need a lot of endpoints and many of them can be dynamic.

This is where `FastAPI` comes in handy.

With fast api we can do:

- Dynamic routing
- Query parameters
- Path parameters

And many more.

So, let's say we have a database with a lot of todo items. We want to extract a single todo item from the database.

We cannot really make that many paths manually. So, we can use `path parameters` to do that.

So, let's make a new function inside the `main.py` file,

```python
#backend/main.py

...

async def read_item(item_id: int):
    return {"item_id": item_id}
```

This function will take a `item_id` as a parameter and return a messege that says the `item_id` of the todo item.

So, as we know that it'll take a cirtain `item_id` as a parameter, in the url we need to pass the `item_id` as a parameteras well.

```python {.line-numbers}
#backend/main.py

...

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```

Here, we are doing a get request to the `/items/{items_id}` endpoint. We can go to that `/items` and then pass the `/2` as a parameter or `/3` as the item id.

This will be a dynamic endpoint and the function will get the `item_id` as a parameter from the url.

So, try it out.

If you enter something other than a number, you'll get an error.

```json
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": ["path", "item_id"],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "dawdaw"
    }
  ]
}
```
Also, another thing you need to be careful about is that the order matters.

So, if you have a route like this `/items/all` that will return all the items in the database.

And it's written after `/items/{item_id}`. 

It'll have a conflict because `/items/{item_id}` will intercept the request before the `/items/all` route.

So, it'll show a `error`.

One thing that sometimes get overlooked is that fastapi uses `type hints`.

For example, in the above code, we have, a parameter called `item_id` that is of type `int`.

This might not be a big deal when you are developing a python app but for fastapi, it is very important.

Because if I just remove the `:` and the `int` from the parameter, it will work for every kind of data type.

So, by type hinting we are actually forcing the type of the parameter.

And anything other than the type specified in the type hint will `throw an error`.

## Predefined endpoints

Let's say we have a endpoint that might have multiple parameters. Anything other than the parameters specified it'll not work. In that case we have to manually chekc if the parameters in the url are valid or not.

But fastapi makes things easier for us.

Like we can use a `enum` class to check if the parameter is valid or not.

```python {.line-numbers}
#backend/main.py
from enum import Enum

... 

class PredefinedEndpoints(str, Enum):
    life = "life"
    universe = "universe"
    everything = "everything"
```

> Enum is a class that is used to create a list of constants. This enum will work as a type hint and fast api will use this to check if the parameter is valid or not.

It's like a custom type that has a list of constant values.

Now, we can use this enum to check if the parameter is valid or not.

```python {.line-numbers}
#backend/main.py

...

@app.get("/items/type/{item_type}")
async def read_item(item_type: PredefinedEndpoints):
    return {"item_type": item_type}
```

Now, if you enter `/items/type/universe` in the url, it will work.

Anything other than `life`, `universe` or `everything` will not work.

### Docs

Fastapi provides a nice way to document and test your api.

you can go to the `/docs` endpoint to see the docs.

![alt text](image-2.png)

Here, you will see every single endpoint that you have defined in the `main.py` file.

And also you can test the endpoints.

Click and expand the endpoint you want to test.

> Try it out...

One last thing before we start the frontend app.

### Query parameters

Query parameters are parameters that are not passed in the url but is passed in the query string.

These are used to do filtering and sorting.

We can pass a query parameter like this,

```python {.line-numbers}
@app.get("/items/{id}")
async def some_function(id: int, q: Optional[str] = None):
    return {"id": id, "q": q}
```

If the url is a `dynamic` url than the first parameters will be recognized as the `path parameter` and any other parameters after will be recognized as `query parameters`.

With that done let's start the frontend app.

# Starting the React app

You need to have `nodejs` and `npm` installed.

If you don't have it installed, you can download it [here](https://nodejs.org/en/download/).

Now, open the terminal and navigate to your root directory and run the following command,

```bash
npm create vite@latest
```

Name the project `frontend` and press enter.

then as a framework select `react` and press enter.

select the javascript variant and press enter.

> You can select no for `rolldown-vite` 

And after that there should ne no more prompts.

If there is just select `no`.

Now, You'll see that there's a folder created called `frontend` in your root directory.

in the terminal navigate to the `frontend` directory and run the following command,

```bash
npm install
```

```bash
npm run dev
```
This will start the react app.

Now, open your browser and go to `http://localhost:5173/`. You should see a nice react app... Too bad I'm going to remove every single one of these boilerplate...

But first we need to install some packages.

We will need,

- `axios` for making http requests
- `react-router` for routing
- `bootstrap` for styling

Nagivate to frontend again and run the following command,

```bash
pm install react-router bootstrap bootswatch react-icons axios      
```
- `bootswatch` is used for bootstrap themes.
- `react-icons` is used for icons.

Now, let's make the frontend app clear and start working.

Open the `frontend` folder and go to the `src` folder. Remove everything inside the `src` folder except the `App.jsx and main.jsx` file.

Now, open the `App.jsx` file and remove everything inside it.

And write the following code,

```jsx {.line-numbers}
//src/App.jsx

function App() {

  return (
    <>
      <h1>
        TODO
      </h1>
    </>
  )
}

export default App
```

Inside the `main.jsx` file, remove the import statements for every css file. The main.jsx file should look like this,

```jsx {.line-numbers}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Now, that we have a clean frontend app, a small overview of what we are dealing with.

Every line of code will be written inside the `src` directory.

App is the `main component` of the app.

Main is the `root component` of the app.

We will setup router and bootstrap in these files.

But first, let's use axios to fetch data from the backend.