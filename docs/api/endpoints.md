---
title: API Endpoints
layout: single
toc: true
---

Wizz-Vis comes with a RESTful API for management and automation purpose. With the API the user can consult the datasources and its dimensions and aggregators, create, update and destroy dashboards and widgets, and so on.

## Swagger UI

<figure>
    <a href="{{ '/assets/images/swagger-ui.png' | relative_url }}"><img src="{{ '/assets/images/swagger-ui.png' | relative_url }}"></a>
</figure>

The users can interact and read the API documentation located at `/swagger-ui`.

## Content Type

Wizz-Vis API works with JSON payloads. It allows us to handle complex bodies.

```json
{
  "type": "WidgetValue",
  "title": "Bytes/minute",
  "row": 0,
  "col": 0,
  "size_x": 4,
  "size_y": 4,
  "dashboard_id": 22,
  "datasource_id": 56,
  "range": "last_1_hour",
  "granularity": "minute",
  "options": {
    "gauge": {
      "show": true,
      "max": 500000,
      "thresholds": [
        [0.33, "#3DCC91"],
        [0.66, "#FFB366"],
        [1, "#FF7373"]
      ]
    },
    "links": [
      {
        "url": "/dashboards/1",
        "name": "MWC 17",
        "type": "dashboard"
      }
    ]
  },
  "aggregators": [
    {
      "aggregator": "clients",
      "aggregator_name": "clients"
    }
  ]
}
```

## Base URL

All API endpoints are relative to the base URL. In that case, and assuming that Wizz-Vis is reachable with the domain name `wizz-vis.lan`, the base URL for the API is:

```
http://wizz-vis.lan/api/v1
```

## Enpoints

All endpoints are relative to the base URL of Wizz-Vis API.

### Datasource

#### List Datasources

##### Endpoint
```
GET /datasources
```

##### Response
```
HTTP 200 OK
```

```json
[
  {
    "id": 13,
    "name": "6d491862-c6e7-4534-a1f7-7cf9e0b84fa2_solaris",
    "dimensions": [
      {
        "id": 159,
        "name": "sensorID"
      },
      {
        "id": 155,
        "name": "coordinates"
      },
      {
        "id": 151,
        "name": "__time"
      }
    ],
    "aggregators": [
      {
        "id": 53,
        "name": "tempDiff",
        "aggregator_type": "doubleSum"
      },
      {
        "id": 54,
        "name": "tempInside",
        "aggregator_type": "doubleSum"
      },
      {
        "id": 56,
        "name": "binPump",
        "aggregator_type": "longSum"
      },
      {
        "id": 58,
        "name": "tempOutside",
        "aggregator_type": "doubleSum"
      },
      {
        "id": 62,
        "name": "events",
        "aggregator_type": "longSum"
      }
    ]
  },
  {
    "id": 15,
    "name": "17c1ee08-4bdd-495a-9227-0cde2bea93b9_flow",
    "dimensions": [
      {
        "id": 168,
        "name": "wireless_station"
      },
      {
        "id": 165,
        "name": "wireless_id"
      },
      {
        "id": 160,
        "name": "type"
      },
      {
        "id": 157,
        "name": "direction"
      },
      {
        "id": 153,
        "name": "client_mac"
      },
      {
        "id": 149,
        "name": "__time"
      }
    ],
    "aggregators": [
      {
        "id": 59,
        "name": "sum_pkts",
        "aggregator_type": "longSum"
      },
      {
        "id": 61,
        "name": "clients",
        "aggregator_type": "hyperUnique"
      },
      {
        "id": 63,
        "name": "sum_rssi",
        "aggregator_type": "longSum"
      },
      {
        "id": 64,
        "name": "events",
        "aggregator_type": "longSum"
      },
      {
        "id": 65,
        "name": "sum_bytes",
        "aggregator_type": "longSum"
      }
    ]
  }
]
```

#### Retrieve Datasource

##### Endpoint
```
GET /datasources/{id}
```

| Attribute     | Description |
| ------------- |-------------|
| `id` *Required* | The unique identifier associated with the datasource |

##### Response
```
HTTP 200 OK
```

```json
{
  "id": 15,
  "name": "17c1ee08-4bdd-495a-9227-0cde2bea93b9_flow",
  "dimensions": [
    {
      "id": 168,
      "name": "wireless_station"
    },
    {
      "id": 165,
      "name": "wireless_id"
    },
    {
      "id": 160,
      "name": "type"
    },
    {
      "id": 157,
      "name": "direction"
    },
    {
      "id": 153,
      "name": "client_mac"
    },
    {
      "id": 149,
      "name": "__time"
    }
  ],
  "aggregators": [
    {
      "id": 59,
      "name": "sum_pkts",
      "aggregator_type": "longSum"
    },
    {
      "id": 61,
      "name": "clients",
      "aggregator_type": "hyperUnique"
    },
    {
      "id": 63,
      "name": "sum_rssi",
      "aggregator_type": "longSum"
    },
    {
      "id": 64,
      "name": "events",
      "aggregator_type": "longSum"
    },
    {
      "id": 65,
      "name": "sum_bytes",
      "aggregator_type": "longSum"
    }
  ]
}
```

### Dimension

#### List Dimensions

##### Endpoint
```
GET /datasources/{datasource_id}/dimensions
```

| Attribute     | Description |
| ------------- |-------------|
| `datasource_id` *Required* | The unique identifier associated with the datasource |

##### Response
```
HTTP 200 OK
```

```json
[
  {
    "id": 168,
    "name": "wireless_station"
  },
  {
    "id": 165,
    "name": "wireless_id"
  },
  {
    "id": 160,
    "name": "type"
  },
  {
    "id": 157,
    "name": "direction"
  },
  {
    "id": 153,
    "name": "client_mac"
  },
  {
    "id": 149,
    "name": "__time"
  }
]
```

### Aggregator

#### List Aggregators

##### Endpoint
```
GET /datasources/{datasource_id}/aggregators
```

| Attribute     | Description |
| ------------- |-------------|
| `datasource_id` *Required* | The unique identifier associated with the datasource |

##### Response
```
HTTP 200 OK
```

```json
[
  {
    "id": 59,
    "name": "sum_pkts",
    "aggregator_type": "longSum"
  },
  {
    "id": 61,
    "name": "clients",
    "aggregator_type": "hyperUnique"
  },
  {
    "id": 63,
    "name": "sum_rssi",
    "aggregator_type": "longSum"
  },
  {
    "id": 64,
    "name": "events",
    "aggregator_type": "longSum"
  },
  {
    "id": 65,
    "name": "sum_bytes",
    "aggregator_type": "longSum"
  }
]
```

### Widget

#### List Widgets

##### Endpoint
```
GET /dashboards/{dashboard_id}/widgets
```

| Attribute     | Description |
| ------------- |-------------|
| `dashboard_id` *Required* | The unique identifier associated with the dashboard |

##### Response
```
HTTP 200 OK
```

```json
[
  {
    "id": 1,
    "type": "WidgetText",
    "title": null,
    "dashboard_id": 1,
    "row": 4,
    "col": 0,
    "size_x": 5,
    "size_y": 4,
    "range": "last_1_hour",
    "granularity": null,
    "start_time": null,
    "end_time": null,
    "limit": null,
    "options": {
      "text": "The Wizzie Data Platform, or WDP, is a blazingly fast, highly scalable, end-to-end solution for real-time processing, storage and visualization of any data type and format.",
      "fontSize": "10px",
      "background": {
        "color": "transparent"
      }
    },
    "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_flow",
    "dimensions": [],
    "aggregators": [],
    "post_aggregators": [],
    "filters": []
  },
  {
    "id": 5,
    "type": "WidgetHistogram",
    "title": null,
    "dashboard_id": 1,
    "row": 4,
    "col": 5,
    "size_x": 7,
    "size_y": 4,
    "range": null,
    "granularity": null,
    "start_time": "2018-02-27T00:00:00.000Z",
    "end_time": "2018-03-01T00:00:00.000Z",
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
      },
      "thresholds": [
        {
          "color": "orange",
          "label": "Break 1",
          "value": 45000000
        },
        {
          "color": "red",
          "label": "Break 2",
          "value": 90000000
        }
      ]
    },
    "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_cmx",
    "dimensions": [],
    "aggregators": [
      {
        "aggregator": "hist_dwell",
        "aggregator_name": "hist_dwell",
        "filters": []
      }
    ],
    "post_aggregators": [],
    "filters": []
  }
]
```

#### Retrieve Widget

##### Endpoint
```
GET /widgets/{id}
```

| Attribute     | Description |
| ------------- |-------------|
| `id` *Required* | The unique identifier associated with the widget |

##### Response
```
HTTP 200 OK
```

```json
{
  "id": 1,
  "type": "WidgetText",
  "title": null,
  "dashboard_id": 1,
  "row": 4,
  "col": 0,
  "size_x": 5,
  "size_y": 4,
  "range": "last_1_hour",
  "granularity": null,
  "start_time": null,
  "end_time": null,
  "limit": null,
  "options": {
    "text": "The Wizzie Data Platform, or WDP, is a blazingly fast, highly scalable, end-to-end solution for real-time processing, storage and visualization of any data type and format.",
    "fontSize": "10px",
    "background": {
      "color": "transparent"
    }
  },
  "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_flow",
  "dimensions": [],
  "aggregators": [],
  "post_aggregators": [],
  "filters": []
}
```

#### Retrieve Widget Query Result

##### Endpoint
```
GET /widgets/{id}/data
```

| Attribute     | Description |
| ------------- |-------------|
| `dashboard_id` *Required* | The unique identifier associated with the dashboard |

##### Response
```
HTTP 200 OK
```

The response body will depend on the widget's type requested.

#### Create Widget

##### Endpoint
```
POST /widgets
```

##### Request Body

| Attribute     | Description   |
| ------------- |-------------|
| `type` *Required* | The widget's type. |
| `dashboard_id` *Required* | The identifier of the dashboard that will contain the widget. |
| `datasource_name` *Required* | The datasource's name associated with the data. |
| `row` *Required* | The row of the dashboard that will contain the widget, starting from `0`. |
| `col` *Required* | The column of the dashboard that will contain the widget, from `0` to `11`. |
| `size_x` *Required* | The width of the widget, from `1` to `12`.  |
| `size_y` *Required* | The height of the widget, starting from `1`. |
| `title` *Optional* | The widget's title. It will appear at the top of the widget. |
| `range` *Optional* | Attribute used to set the time interval to represent. Visit [range]({{ '/guides/widgets#range' | relative_url }}) to check the possible values.  |
| `start_time` *Optional* | Used to include a fixed interval. If range is setted, these attributes are ignored. |
| `end_time` *Optional* | Used to include a fixed interval. If range is setted, these attributes are ignored. |
| `granularity` *Optional* | Determine how the data will be aggregated. Visit [granularity]({{ '/guides/widgets#granularity' | relative_url }}) to check the possible values. |
| `limit` *Optional* | Number of elements to be returned. |
| `options` *Optional* | Attributes used to modify the style and behavior of the widget. he content depends on the type of widget created. |
| `dimensions` *Optional* | Array of dimension's names to be represented. |
| `aggregators` *Optional* | Array of [Aggregator](#model_aggregator) to be represented. |
| `filters` *Optional* | Array of [Filter](#filter) to be included in the query. |
| `post_aggregators` *Optional* | Array of [PostAggregator](#postaggregator) to be calculated. |

##### Response
```
HTTP 200 OK
```

```json
{
  "id": 6,
  "type": "WidgetHeatmap",
  "title": null,
  "dashboard_id": 1,
  "row": 0,
  "col": 0,
  "size_x": 12,
  "size_y": 4,
  "range": null,
  "granularity": null,
  "start_time": "2018-02-27T00:00:00.000Z",
  "end_time": "2018-03-01T00:00:00.000Z",
  "limit": 1000,
  "options": {},
  "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_cmx",
  "dimensions": [
    "client_latlong"
  ],
  "aggregators": [
    {
      "aggregator": "events",
      "aggregator_name": "events",
      "filters": []
    }
  ],
  "post_aggregators": [],
  "filters": []
}
```

#### Update Widget

##### Endpoint
```
PATCH /widgets/{id}
```

| Attribute     | Description |
| ------------- |-------------|
| `id` *Required* | The unique identifier associated with the widget |

##### Request Body

You must only include those attributes to be updated.

| Attribute     | Description |
| ------------- |-------------|
| `dashboard_id` *Optional* | The identifier of the dashboard that will contain the widget.  |
| `datasource_name` *Optional* | The datasource's name associated with the data. |
| `row` *Optional* | The row of the dashboard that will contain the widget, starting from `0`. |
| `col` *Optional* | The column of the dashboard that will contain the widget, from `0` to `11`. |
| `size_x` *Optional* | The width of the widget, from `1` to `12`. |
| `size_y` *Optional* | The height of the widget, starting from `1`. |
| `title` *Optional* | The widget's title. It will appear at the top of the widget. |
| `range` *Optional* | Attribute used to set the time interval to represent. Visit [range]({{ '/guides/widgets#range' | relative_url }}) to check the possible values. |
| `start_time` *Optional* | Used to include a fixed interval. If range is setted, these attributes are ignored. |
| `end_time` *Optional* | Used to include a fixed interval. If range is setted, these attributes are ignored. |
| `granularity` *Optional* | Determine how the data will be aggregated. Visit [granularity]({{ '/guides/widgets#granularity' | relative_url }}) to check the possible values. |
| `limit` *Optional* | Number of elements to be returned. |
| `options` *Optional* | Attributes used to modify the style and behavior of the widget. he content depends on the type of widget created. |
| `dimensions` *Optional* | Array of dimension's names to be represented. |
| `aggregators` *Optional* | Array of [Aggregator](#model_aggregator) to be represented. |
| `filters` *Optional* | Array of [Filter](#filter) to be included in the query. |
| `post_aggregators` *Optional* | Array of [PostAggregator](#postaggregator) to be calculated. |

##### Response
```
HTTP 200 OK
```

```json
{
  "id": 6,
  "type": "WidgetHeatmap",
  "title": null,
  "dashboard_id": 1,
  "row": 0,
  "col": 0,
  "size_x": 12,
  "size_y": 4,
  "range": null,
  "granularity": null,
  "start_time": "2018-02-27T00:00:00.000Z",
  "end_time": "2018-03-01T00:00:00.000Z",
  "limit": 1000,
  "options": {},
  "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_cmx",
  "dimensions": [
    "client_latlong"
  ],
  "aggregators": [
    {
      "aggregator": "events",
      "aggregator_name": "events",
      "filters": []
    }
  ],
  "post_aggregators": [],
  "filters": []
}
```

#### Delete Widget

##### Endpoint
```
DELETE /widgets/{id}
```

| Attribute     | Description |
| ------------- |-------------|
| `id` *Required* | The unique identifier associated with the widget |

##### Response
```
HTTP 200 OK
```

### Dashboard

#### List Dashboards

##### Endpoint
```
GET /dashboards
```

##### Response
```
HTTP 200 OK
```

```json
[
  {
    "id": 1,
    "name": "Dashboard 1",
    "theme": "light",
    "interval": null,
    "locked": false,
    "widgets": [
      {
        "id": 1,
        "type": "WidgetText",
        "title": null,
        "dashboard_id": 1,
        "row": 4,
        "col": 0,
        "size_x": 5,
        "size_y": 4,
        "range": "last_1_hour",
        "granularity": null,
        "start_time": null,
        "end_time": null,
        "limit": null,
        "options": {
          "text": "The Wizzie Data Platform, or WDP, is a blazingly fast, highly scalable, end-to-end solution for real-time processing, storage and visualization of any data type and format.",
          "fontSize": "10px",
          "background": {
            "color": "transparent"
          }
        },
        "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_flow",
        "dimensions": [],
        "aggregators": [],
        "post_aggregators": [],
        "filters": []
      },
      {
        "id": 5,
        "type": "WidgetHistogram",
        "title": null,
        "dashboard_id": 1,
        "row": 4,
        "col": 5,
        "size_x": 7,
        "size_y": 4,
        "range": null,
        "granularity": null,
        "start_time": "2018-02-27T00:00:00.000Z",
        "end_time": "2018-03-01T00:00:00.000Z",
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
          },
          "thresholds": [
            {
              "color": "orange",
              "label": "Break 1",
              "value": 45000000
            },
            {
              "color": "red",
              "label": "Break 2",
              "value": 90000000
            }
          ]
        },
        "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_cmx",
        "dimensions": [],
        "aggregators": [
          {
            "aggregator": "hist_dwell",
            "aggregator_name": "hist_dwell",
            "filters": []
          }
        ],
        "post_aggregators": [],
        "filters": []
      }
    ]
  },
  {
    "id": 2,
    "name": "Dashboard 2",
    "theme": "light",
    "interval": null,
    "locked": false,
    "widgets": [
      {
        "id": 6,
        "type": "WidgetHeatmap",
        "title": null,
        "dashboard_id": 1,
        "row": 0,
        "col": 0,
        "size_x": 12,
        "size_y": 4,
        "range": null,
        "granularity": null,
        "start_time": "2018-02-27T00:00:00.000Z",
        "end_time": "2018-03-01T00:00:00.000Z",
        "limit": 1000,
        "options": {},
        "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_cmx",
        "dimensions": [
          "client_latlong"
        ],
        "aggregators": [
          {
            "aggregator": "events",
            "aggregator_name": "events",
            "filters": []
          }
        ],
        "post_aggregators": [],
        "filters": []
      }
    ]
  }
]
```

#### Retrieve Dashboard

##### Endpoint
```
GET /dashboards/{id}
```

| Attribute     | Description |
| ------------- |-------------|
| `id` *Required* | The unique identifier associated with the dashboard |

##### Response
```
HTTP 200 OK
```

```json
{
  "id": 2,
  "name": "Dashboard 2",
  "theme": "light",
  "interval": null,
  "locked": false,
  "widgets": [
    {
      "id": 6,
      "type": "WidgetHeatmap",
      "title": null,
      "dashboard_id": 1,
      "row": 0,
      "col": 0,
      "size_x": 12,
      "size_y": 4,
      "range": null,
      "granularity": null,
      "start_time": "2018-02-27T00:00:00.000Z",
      "end_time": "2018-03-01T00:00:00.000Z",
      "limit": 1000,
      "options": {},
      "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_cmx",
      "dimensions": [
        "client_latlong"
      ],
      "aggregators": [
        {
          "aggregator": "events",
          "aggregator_name": "events",
          "filters": []
        }
      ],
      "post_aggregators": [],
      "filters": []
    }
  ]
}
```

#### Create Dashboard

##### Endpoint
```
POST /dashboards
```

##### Request Body

| Attribute     | Description |
| ------------- |-------------|
| `name` *Required* | The dashboard's name |
| `theme` *Optional* | Dashboard's theme: `light` or `dark` (defaults to `light`)  |
| `interval` *Optional* | Automatic reload for the dashboard in seconds: `30`, `60`, `300`, `900`, `1800`, `3600`, `7200` or `null` (defaults to `null`, with no reload) |
| `locked` *Optional* | Allow modify the dashboard's layout: `true` or `false` |
| `widgets` *Optional* | Array of widgets. |

##### Response
```
HTTP 200 OK
```

```json
{
  "id": 2,
  "name": "Dashboard 2",
  "theme": "light",
  "interval": null,
  "locked": false,
  "widgets": [
    {
      "id": 6,
      "type": "WidgetHeatmap",
      "title": null,
      "dashboard_id": 1,
      "row": 0,
      "col": 0,
      "size_x": 12,
      "size_y": 4,
      "range": null,
      "granularity": null,
      "start_time": "2018-02-27T00:00:00.000Z",
      "end_time": "2018-03-01T00:00:00.000Z",
      "limit": 1000,
      "options": {},
      "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_cmx",
      "dimensions": [
        "client_latlong"
      ],
      "aggregators": [
        {
          "aggregator": "events",
          "aggregator_name": "events",
          "filters": []
        }
      ],
      "post_aggregators": [],
      "filters": []
    }
  ]
}
```

#### Update Dashboard

##### Endpoint
```
PATCH /dashboards/{id}
```

| Attribute     | Description |
| ------------- |-------------|
| `id` *Required* | The unique identifier associated with the dashboard |

##### Request Body

| Attribute     | Description   |
| ------------- |-------------|
| `name` *Optional* | The dashboard's name |
| `theme` *Optional* | Dashboard's theme: `light` or `dark` (defaults to `light`)  |
| `interval` *Optional* | Automatic reload for the dashboard in seconds: `30`, `60`, `300`, `900`, `1800`, `3600`, `7200` or `null` (defaults to `null`, with no reload) |
| `locked` *Optional* | Allow modify the dashboard's layout: `true` or `false` |

##### Response
```
HTTP 200 OK
```

```json
{
  "id": 2,
  "name": "Dashboard 2",
  "theme": "light",
  "interval": null,
  "locked": false,
  "widgets": [
    {
      "id": 6,
      "type": "WidgetHeatmap",
      "title": null,
      "dashboard_id": 1,
      "row": 0,
      "col": 0,
      "size_x": 12,
      "size_y": 4,
      "range": null,
      "granularity": null,
      "start_time": "2018-02-27T00:00:00.000Z",
      "end_time": "2018-03-01T00:00:00.000Z",
      "limit": 1000,
      "options": {},
      "datasource_name": "046b3814-0d0c-4fd0-98ea-32ba740709c3_cmx",
      "dimensions": [
        "client_latlong"
      ],
      "aggregators": [
        {
          "aggregator": "events",
          "aggregator_name": "events",
          "filters": []
        }
      ],
      "post_aggregators": [],
      "filters": []
    }
  ]
}
```

#### Delete Dashboard

##### Endpoint
```
DELETE /dashboards/{id}
```

| Attribute     | Description |
| ------------- |-------------|
| `id` *Required* | The unique identifier associated with the dashboard |

##### Response
```
HTTP 200 OK
```

## Models

### Aggregator {#model_aggregator}

| Attribute       | Type            | Description |
| ----------------|-----------------|-------------|
| aggregator      | String          | Name of the aggregator to be used. |
| aggregator_name | String          | If the aggregator include filters, the display name could be changed. |
| filters         | Array of [Filter](#filter) | Filters to apply to that aggregator. |

### PostAggregator

| Attribute       | Type   | Description |
| ----------------|--------|-------------|
| output_name     | String | Display name of the aggregator result. |
| operator        | String | Operator to be applied. One of `+`, `-`, `*` or `/`. If both aggregators are `thetasketch`, the operators must be `UNION`, `INTERSECT` or `NOT` |
| field_1         | String or Float | Represent an aggregator's name or a constant. |
| field_2         | String or Float | Represent an aggregator's name or a constant. |

**Note:** The aggregators referenced by the post aggregators have to be included as aggregators themselves.
{: .notice--warning}

### Filter

| Attribute       | Type   | Description |
| ----------------|--------|-------------|
| dimension_name  | String | Dimension's name to be filtered |
| operator        | String | One of: `eq`, `neq` or `regex` |
| value           | String | Value to appy the operator. It could be `null`. If using `regex` as operator, the value should be represented without enclosure slashes. |
