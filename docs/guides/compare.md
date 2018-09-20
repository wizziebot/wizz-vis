---
title: Compare
layout: single
---

<figure class="half">
    <a href="{{ '/assets/images/compare_1.png' | relative_url }}"><img src="{{ '/assets/images/compare_1.png' | relative_url }}"></a>
    <a href="{{ '/assets/images/compare_2.png' | relative_url }}"><img src="{{ '/assets/images/compare_2.png' | relative_url }}"></a>
    <figcaption></figcaption>
</figure>

Several widgets have the ability to be compared within a past interval. The referenced interval is configured through the `options` attribute in the way of `amount` `range` ago.

```json
{
  "compare": {
    "range": "minutes" | "hours" | "days" | "weeks" | "months",
    "amount": 2
  }
}
```

For instance, if we have a widget configured to represent a metric for today (Monday) and we want to compare that metric with the Monday from past week, we have to configure the `compare` option with `range: week` and `amount: 1`.

Also, we can use `previous_period` as `range` value, without the needed of complete the `amount` value.
