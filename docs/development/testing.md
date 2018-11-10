---
title: "Development - Testing"
layout: single
---

1. Set up your development as explained at [`Development - From Scratch`](/development/from-scratch).
2. Run `rspec` to execute the full test suite.

```
$ bundle exec rspec
..................*.....**.*******..**.***********........................*.......*............................

Finished in 3.67 seconds (files took 4.86 seconds to load)
111 examples, 0 failures, 25 pending

Coverage report generated for RSpec to wizz-vis/coverage. 857 / 1557 LOC (55.04%) covered.
```

A report about the coverage has been created at `coverage/index.html`

## Bundler audit

Using the gem `bundler-audit`, we can check for vulnerable versions of gems in `Gemfile.lock`.

```
$ bundle exec bundle audit check --update
Updating ruby-advisory-db ...
remote: Counting objects: 11, done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 11 (delta 6), reused 11 (delta 6), pack-reused 0
Unpacking objects: 100% (11/11), done.
From https://github.com/rubysec/ruby-advisory-db
 * branch            master     -> FETCH_HEAD
   0ff419e..5e60b09  master     -> origin/master
Updating 0ff419e..5e60b09
Fast-forward
 gems/ffi/CVE-2018-1000201.yml | 22 ++++++++++++++++++++++
 1 file changed, 22 insertions(+)
 create mode 100644 gems/ffi/CVE-2018-1000201.yml
Updated ruby-advisory-db
ruby-advisory-db: 322 advisories
No vulnerabilities found
```
