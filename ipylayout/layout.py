#!/usr/bin/env python
# coding: utf-8

# Copyright (c) David Brochart.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget, Widget
from traitlets import Int, Unicode, Dict, List, observe
from ._frontend import module_name, module_version

from ipywidgets import widget_serialization
from traitlets import Instance
import traitlets


class TypedTuple(traitlets.Container):
    """A trait for a tuple of any length with type-checked elements."""
    klass = tuple
    _cast_types = (list,)


class Layout(DOMWidget):
    """A layout widget based on GoldenLayout
    """
    _model_name = Unicode('LayoutModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('LayoutView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    config = Dict().tag(sync=True)
    components = Dict(help='Dictionary of component name -> widget')
    theme = Unicode('light', help='Theme (light or dark)').tag(sync=True)

    _children = TypedTuple(trait=Instance(Widget)).tag(sync=True, **widget_serialization)
    _component_names = List().tag(sync=True)

    @observe('components')
    def components_changed(self, change):
        c = change['new']
        self._component_names = list(c.keys())
        self._children = list(c.values())
