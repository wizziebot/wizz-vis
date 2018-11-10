---
title: Drill Down
layout: single
---

<figure>
    <a href="{{ '/assets/images/drill_down.png' | relative_url }}"><img src="{{ '/assets/images/drill_down.png' | relative_url }}"></a>
    <figcaption></figcaption>
</figure>

We can create drill downs at each widget. The drill down has to be set in the `options` attribute. The drill down can contains more than one link, external resources and dashboard links.

```json
{
  "links": [
    {
      "url": "https://wizzie.io",
      "name": "Wizzie Web",
      "type": "absolute"
    },
    {
      "url": "/dashboards/1",
      "name": "Clients detail",
      "type": "dashboard"
    }
  ]
}
```
