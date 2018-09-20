---
title: Basic Concepts
layout: single
toc: true
---

This document will be an introduction to the most basic concepts of Wizz-Vis. Each concept will be developed more widely in its corresponding sections.

## Datasource

Druid data is stored in datasources, which are similar to tables in a traditional RDBM.

## Dimension

Dimensions are fields that can be filtered on or grouped by. They are always single Strings, arrays of Strings, single Longs, single Doubles or single Floats.

## Aggregator

Aggregators are metrics that can be aggregated. They are often stored as numbers (integers or floats) but can also be stored as complex objects like HyperLogLog sketches or approximate histogram sketches.

[More info]({{ '/guides/aggregators' | relative_url }})

## Dashboard

The Dashboard is where it all comes together. Dashboards can be thought of as of a set of one or more Widgets.

[More info]({{ '/guides/dashboards' | relative_url }})

## Widget

Widget is the basic visualization element at Wizz-Vis. It represent a KPI selecting Dimensions and Aggregators from a Datasource.

[More info]({{ '/guides/widgets' | relative_url }})

## API

Wizz-Vis include a powerful API-REST aimed to create and customize the widgets, including export and import them. Also, it can be used to manage the dashboards and list the Datasources, Dimensions and Aggregators.

[More info]({{ '/api/endpoints' | relative_url }})
