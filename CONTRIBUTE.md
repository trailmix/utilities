# Contribute

## Coverage

Here are some tips for dealing with coverage gutters.

The goal is to allow it to look like the example below. The extension needs to
be installed, and enabled. I typically press **F1** and type "Display Coverage"
and enter or **SHIFT + CMD + 7** for a shortcut.

Assuming you have a valid coverage report at _./coverage/lcov.info_ (change in
_.vscode/settings.json_ or other) then this will display as below.

As you make changes, you need to update the coverage reports so the gutters stay
consistent with your work. See the example below for how to do that.
![gutters-f1](https://trailmix-images.s3.amazonaws.com/utilities/f1.png)

![gutters](https://trailmix-images.s3.amazonaws.com/utilities/gutters.png)

```bash
# remove old coverage reports
rm -rf coverage
# run a test OR
deno test --allow-write --allow-read --allow-env --unstable --import-map=import_map.json --fail-fast --coverage=./coverage/output src/common/file_test.ts
# run all tests
deno test --allow-write --allow-read --allow-env --unstable --import-map=import_map.json --fail-fast --coverage=./coverage/output
# generage lcov.info, must have exclude as the default doesn't have the _
deno coverage --exclude="(_|.)conf(ig){0,1}\.(ts|js|tsx)" --exclude="_test\.(ts|js)" --unstable ./coverage --lcov > ./coverage/lcov.info
# at this point you would reload you coverage with SHIFT+CMD+7 or F1 + "Display Coverage" + enter
# optionally, generate a coverage report to view in a browser
genhtml -o coverage/html ./coverage/lcov.info
```

## Docker

```bash
# docker should be installed
docker build -t trailmix -f .docker/Dockerfile .

# now run tests
docker run trailmix deno test --unstable --allow-write --allow-read --allow-env --import-map=import_map.json
```

## imports

### std/path

| function          | from                                                                                                           | to                                                                                                                  |
| :---------------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| MATH              |                                                                                                                |                                                                                                                     |
| resolve           | 'a/b/../d/c','b','c'                                                                                           | /Users/trilom/repos/utilities/a/d/c/b/c                                                                             |
| resolve(absolute) | '/a/b/../d/c','b','c'                                                                                          | /a/d/c/b/c                                                                                                          |
| normalize         | 'a/b/../d/c'                                                                                                   | a/d/c                                                                                                               |
| join              | 'a/b/../d/c','b','c'                                                                                           | a/d/c/b/c                                                                                                           |
| isAbsolute        | /a/b/c                                                                                                         | true                                                                                                                |
| isAbsolute(false) | a/b/c                                                                                                          | false                                                                                                               |
| relative          | /Users/trilom/repos/utilities,/Users/trilom                                                                    | ../../                                                                                                              |
| dirname           | /Users/trilom/repos/utilities/trailmix.config.ts                                                               | /Users/trilom/repos/utilities                                                                                       |
| basename          | /Users/trilom/repos/utilities/trailmix.config.ts                                                               | trailmix.config.ts                                                                                                  |
| basename(no ext)  | /Users/trilom/repos/utilities/trailmix.config.ts,                                                              | .ts trailmix.config                                                                                                 |
| extname           | /Users/trilom/repos/utilities/trailmix.config.ts                                                               | .ts                                                                                                                 |
| CONVERT           |                                                                                                                |                                                                                                                     |
| fromFileUrl       | file:///Users/trilom/repos/utilities/trailmix.config.ts                                                        | /Users/trilom/repos/utilities/trailmix.config.ts                                                                    |
| toFileUrl         | /Users/trilom/repos/utilities/trailmix.config.ts                                                               | file:///Users/trilom/repos/utilities/trailmix.config.ts                                                             |
| OBJECT            |                                                                                                                |                                                                                                                     |
| parse             | /Users/trilom/repos/utilities/trailmix.config.ts                                                               | {root: "/",dir: "/Users/bkillian/trailmix/utilities",base: "trailmix.config.ts",ext: ".ts",name: "trailmix.config"} |
| format            | {root: "/",dir: "/Users/trilom/repos/utilities",base: "trailmix.config.ts",ext: ".ts",name: "trailmix.config"} | /Users/trilom/repos/utilities/trailmix.config.ts                                                                    |
