# Contributing Guide

## Making Pull Requests

1. Fork [Hozuki/GLantern](https://github.com/Hozuki/GLantern).
2. Clone the forked repository (which is in your account) to your computer and install dependencies.

```bash
$ git clone https://github.com/<username>/GLantern.git /preferred/cloning/destination
$ cd /path/to/GLantern
$ npm install
```

3. Create a branch for modifications.

```bash
$ git checkout -b modification_description
```

4. Do coding work in the `modification_description` branch.
5. Push the `modification_description` branch to your account.

```bash
$ git push origin modification_description
```

6. Create a pull request from your account and describe the changes.

## Naming Convention

**For all classes**

- Public function/property/field: `memberName`
- Protected function: `_$functionName`
- Private function: `__functionName`
- Protected/private field: `_fieldName`

**Special rule for Flash classes**

If a public member does not exist in original class (please refer to ActionScript 3 API
Reference), it should be named like `$memberName`.
