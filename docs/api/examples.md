---
title: API Examples
layout: single
toc: true
---

In this page we are going to show some examples of how to create different type of widgets using filters, post aggregators and filtered aggregators.

### Post Aggregators

The next widget represent a table with one dimension, `id`, and two metrics, `speed` and `sumUsers`. The metric `speed` is a post aggregator calculated with two aggregators, `messages` and `sumSpeed`, that have to referenced in the aggregators attribute.

##### Request
```
POST /api/v1/widgets
Accept: application/json
Content-Type: application/json
```
```json
{
  "type": "WidgetTable",
  "title": "Assets Resume",
  "dashboard_id": 25,
  "row": 0,
  "col": 0,
  "size_x": 4,
  "size_y": 3,
  "granularity": "all",
  "start_time": "2018-05-15T14:50:00.000Z",
  "end_time": "2018-05-15T15:07:01.000Z",
  "limit": 5,
  "options": {
    "metrics": [
      "speed",
      "sumUsers"
    ]
  },
  "datasource_name": "985446e3-c2be-416d-9489-4b5f61859566_assets",
  "dimensions": [
    "id"
  ],
  "aggregators": [
    {
      "aggregator": "messages",
      "aggregator_name": "messages",
      "filters": []
    },
    {
      "aggregator": "sumUsers",
      "aggregator_name": "sumUsers",
      "filters": []
    },
    {
      "aggregator": "sumSpeed",
      "aggregator_name": "sumSpeed",
      "filters": []
    }
  ],
  "post_aggregators": [
    {
      "output_name": "speed",
      "operator": "/",
      "field_1": "sumSpeed",
      "field_2": "messages"
    }
  ]
}
```

### Histogram

This widget represent a histogram, using an `approxHistogramFold` aggregator and configuring custom buckets.

##### Request
```
POST /api/v1/widgets
Accept: application/json
Content-Type: application/json
```

```json
{
  "type": "WidgetHistogram",
  "title": "Dwell Time",
  "dashboard_id": 1,
  "row": 4,
  "col": 5,
  "size_x": 7,
  "size_y": 4,
  "range": "current_day",
  "limit": 5,
  "options": {
    "histogram": {
      "type": "customBuckets",
      "breaks": [
        0,
        10,
        60,
        120,
        14400
      ]
    }
  },
  "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_cmx",
  "aggregators": [
    {
      "aggregator": "hist_dwell",
      "aggregator_name": "hist_dwell"
    }
  ]
}
```

### Heatmap

##### Request
```
POST /api/v1/widgets
Accept: application/json
Content-Type: application/json
```

```json
{
  "type": "WidgetHeatmap",
  "title": "Users Distribution",
  "dashboard_id": 25,
  "row": 6,
  "col": 0,
  "size_x": 6,
  "size_y": 3,
  "granularity": "all",
  "range": "last_1_hour",
  "limit": 100,
  "options": {},
  "datasource_name": "985446e3-c2be-416d-9489-4b5f61859566_assets",
  "dimensions": [
    "coordinates"
  ],
  "aggregators": [
    {
      "aggregator": "sumUsers",
      "aggregator_name": "sumUsers",
      "filters": []
    }
  ]
}
```

### Location

##### Request
```
POST /api/v1/widgets
Accept: application/json
Content-Type: application/json
```

```json
{
  "type": "WidgetLocation",
  "title": "Bus Global Position",
  "dashboard_id": 26,
  "row": 0,
  "col": 0,
  "size_x": 12,
  "size_y": 4,
  "range": "last_1_day",
  "granularity": "all",
  "limit": 500,
  "options": {},
  "datasource_name": "985446e3-c2be-416d-9489-4b5f61859566_gijonbus",
  "dimensions": [
    "coordinates",
    "license_plate"
  ],
  "aggregators": [
    {
      "aggregator": "messages",
      "aggregator_name": "messages",
      "filters": []
    }
  ]
}
```

### Route

##### Request
```
POST /api/v1/widgets
Accept: application/json
Content-Type: application/json
```

```json
{
  "type": "WidgetRoute",
  "title": "Route Bus001",
  "dashboard_id": 23,
  "row": 0,
  "col": 4,
  "size_x": 4,
  "size_y": 4,
  "range": "last_1_hour",
  "granularity": "minute",
  "limit": 17,
  "options": {
    "distance_unit": "km",
    "routing_profile": "driving"
  },
  "datasource_name": "985446e3-c2be-416d-9489-4b5f61859566_assets",
  "dimensions": [
    "coordinates",
    "id"
  ],
  "aggregators": [
    {
      "aggregator": "messages",
      "aggregator_name": "messages",
      "filters": []
    }
  ],
  "filters": [
    {
      "dimension_name": "id",
      "operator": "eq",
      "value": "Bus001"
    }
  ]
}
```
