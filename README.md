# angular-server-repeat [![Build Status](https://travis-ci.org/restorando/angular-server-repeat.svg?branch=master)](https://travis-ci.org/restorando/angular-server-repeat)

Convert server-side repeated content into `ngRepeat` compatible [with some restrictions](#caveats-and-restrictions).

## Installation

Include the javascript file and add the `ServerRepeat` module as a dependency of your app.

```js
angular.module('YourApp', ['ServerRepeat']);
```

## Usage

Use the `serverRepeat` directive in your server-side content using `ngRepeat`'s short syntax.

```html
<div ng-controller="PostsController">
    <article server-repeat="post in posts">
        <h4>My awesome first post</h4>
        <span class="author">John Williams</span>
        <div class="summary">My awesome first post summary</div>
    </article>
    <article server-repeat="post in posts">
        <h4>My awesome second post</h4>
        <span class="author">Peter Morello</span>
        <div class="summary">My awesome second post summary</div>
    </article>
    <article server-repeat="post in posts">
        <h4>My awesome last post</h4>
        <span class="author">Mark Lopez</span>
        <div class="summary">My awesome last post summary</div>
    </article>
</div>
```

This will generate a `posts` array in `PostsController` scope, and every post will have a child scope with a reference to the current post in the `post` property, as if rendered client side using `ngRepeat`.

![image](https://cloud.githubusercontent.com/assets/591992/5893438/dd360918-a4c2-11e4-88a9-80caeb6f5f2a.png)

Having a child scope for each member of the collection allows you to "angularize" each item independently. As an example let's hide each post summary and add a link in each post to show it.

```html
<div ng-controller="PostsController">
    <article server-repeat="post in posts">
        <h4>My awesome first post</h4>
        <span class="author">John Williams</span>
        <div class="summary" ng-show="showSummary">My awesome first post summary</div>
        <a href="" ng-click="showSummary = true" ng-hide="showSummary">show summary</a>
    </article>
    <article server-repeat="post in posts">
        <h4>My awesome second post</h4>
        <span class="author">Peter Morello</span>
        <div class="summary" ng-show="showSummary">My awesome second post summary</div>
        <a href="" ng-click="showSummary = true" ng-hide="showSummary">show summary</a>
    </article>
    <article server-repeat="post in posts">
        <h4>My awesome last post</h4>
        <span class="author">Mark Lopez</span>
        <div class="summary" ng-show="showSummary">My awesome last post summary</div>
        <a href="" ng-click="showSummary = true" ng-hide="showSummary">show summary</a>
    </article>
</div>
```

Without a child scope, the snippet above would hide all post summaries as expected, but clicking on any link would display all the summaries instead of the selected one.

### Data Binding

In the previous example, each child scope has a `post` empty object. If you need to use a post's data you can use the `server-bind` directive.

```html
<div ng-controller="PostsController">
    <article server-repeat="post in posts">
        <h4 server-bind="title">My awesome first post</h4>
        <span class="author" server-bind="author">John Williams</span>
        <div class="summary" server-bind="summary">My awesome first post summary</div>
    </article>
    <article server-repeat="post in posts">
        <h4 server-bind="title">My awesome second post</h4>
        <span class="author" server-bind="author">Peter Morello</span>
        <div class="summary" server-bind="summary">My awesome second post summary</div>
    </article>
    <article server-repeat="post in posts">
        <h4 server-bind="title">My awesome last post</h4>
        <span class="author" server-bind="author">Mark Lopez</span>
        <div class="summary" server-bind="summary">My awesome last post summary</div>
    </article>
</div>
```

Now we have the html rendered content parsed and populated into the `post` object in each child scope.

![image](https://cloud.githubusercontent.com/assets/591992/5893513/23a0aedc-a4c6-11e4-9013-5191d4d09feb.png)

##### Note:
`server-bind` works as `ng-bind`, so changing the value of a binded property like the example below will reflect the property update in the DOM.

```javascript
$scope.posts[0].title = "My new title";
```

#### Adding aditional data that is not rendered in the DOM

The `server-bind` directive can be used in the same element that uses the `server-repeat` directive. In this case, it will expect a JSON representation with properties that will be extended to the `post` object.

Example:

```html
<div ng-controller="PostsController">
    <article server-repeat="post in posts" server-bind='{"id":1,"tags":["misc"]}'>
        <h4 server-bind="title">My awesome first post</h4>
        <span class="author" server-bind="author">John Williams</span>
        <div class="summary" server-bind="summary">My awesome first post summary</div>
    </article>
    <article server-repeat="post in posts" server-bind='{"id":2,"tags":["tools", "misc"]}'>
        <h4 server-bind="title">My awesome second post</h4>
        <span class="author" server-bind="author">Peter Morello</span>
        <div class="summary" server-bind="summary">My awesome second post summary</div>
    </article>
    <article server-repeat="post in posts" server-bind='{"id":3,"tags":["music"]}'>
        <h4 server-bind="title">My awesome last post</h4>
        <span class="author" server-bind="author">Mark Lopez</span>
        <div class="summary" server-bind="summary">My awesome last post summary</div>
    </article>
</div>

```

Will produce:

![image](https://cloud.githubusercontent.com/assets/591992/5893560/e78cbf42-a4c7-11e4-88a1-1bb2afb6422c.png)

## Motivation

In Restorando we have full client side apps that use AngularJS intensively, and we also have server rendered apps with custom javascript for some pages. Since we had a great experience with AngularJS in the client side apps, we started to slowly remove the legacy javascript files in our "server-side apps" and replace them with reusable angular directives.

We found in the way that we wanted to add functionality to our "repeated" html snippets, but we didn't want to immerse ourselves in a big refactor to render this data client side using `ngRepeat`. Doing this would also prevent the search engines to index our content.

Searching in the web, we found lots of people trying to accomplish the same thing, like [this question](http://stackoverflow.com/questions/11838639/html-template-filled-in-server-side-and-updated-client-side), [this one](http://stackoverflow.com/questions/25463409/angularjs-server-side-rendering-of-ngrepeat-directive) and [this other one](http://stackoverflow.com/questions/20764100/build-html-in-server-and-bind-to-ng-repeat), none of them succesfully.

Using this directive in our own applications made us more agile, and it allowed us to replace our old javascript code into AngularJS faster and easily.

## Caveats and restrictions

* Changes that modify the collection's length (adding or removing items) won't be reflected in the DOM.
* For the moment you can only bind "flat level" properties using `server-bind`. Deep level properties will be considered for a future version.

## License

Copyright (c) 2015 Restorando

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

