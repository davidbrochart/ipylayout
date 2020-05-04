// Copyright (c) David Brochart
// Distributed under the terms of the Modified BSD License.

import GoldenLayout from 'golden-layout';

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
  unpack_models,
  reject,
  WidgetModel,
  ViewList,
  JupyterPhosphorPanelWidget
} from '@jupyter-widgets/base';

import { MessageLoop } from '@phosphor/messaging';

import { Widget } from '@phosphor/widgets';

import { ArrayExt } from '@phosphor/algorithm';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';

import '../css/widget.css'
import 'golden-layout/src/css/goldenlayout-base.css'
import $ from 'jquery'


export
class LayoutModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: LayoutModel.model_name,
      _model_module: LayoutModel.model_module,
      _model_module_version: LayoutModel.model_module_version,
      _view_name: LayoutModel.view_name,
      _view_module: LayoutModel.view_module,
      _view_module_version: LayoutModel.view_module_version,
      config : {},
      theme : 'light',
      _children : [],
      _component_names : []
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    _children: { deserialize: (unpack_models as any) }
  }

  static model_name = 'LayoutModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'LayoutView';   // Set to null if no view
  static view_module = MODULE_NAME;   // Set to null if no view
  static view_module_version = MODULE_VERSION;
}


export
class LayoutView extends DOMWidgetView {
  _createElement(tagName: string) {
    this.pWidget = new JupyterPhosphorPanelWidget({ view: this });
    return this.pWidget.node;
  }

  _setElement(el: HTMLElement) {
    if (this.el || el !== this.pWidget.node) {
        throw new Error('Cannot reset the DOM element.');
    }

    this.el = this.pWidget.node;
    this.$el = $(this.pWidget.node);
  }

  render() {
    this.el.classList.add('custom-widget');

    let theme = this.model.get('theme');
    if (theme == 'light') {
        require('golden-layout/src/css/goldenlayout-light-theme.css');
    }
    else {
        require('golden-layout/src/css/goldenlayout-dark-theme.css')
    }

    this.children_views = new ViewList(this.add_child_model, null, this);

    this.config_changed();
    this.update_children();
  }

  update_children(): void {
    this.children_views
      .update(this.model.get('_children'))
      .then((views: DOMWidgetView[]) => {
        let component_names = this.model.get('_component_names');
        for (var i in views) {
          let view = views[i];
          console.log(view);
          // Notify all children that their sizes may have changed.
          MessageLoop.postMessage(
            view.pWidget,
            Widget.ResizeMessage.UnknownSize
          );
          this.layout.registerComponent(component_names[i], function(container: any, state: any) {
            container.getElement().html(view.el);
          });
        }
        this.layout.init();
      });
  }

  config_changed() {
    let config = this.model.get('config');
    this.layout = new GoldenLayout(config, this.el);
  }

  add_child_model(model: WidgetModel) {
    // we insert a dummy element so the order is preserved when we add
    // the rendered content later.
    let dummy = new Widget();
    this.pWidget.addWidget(dummy);

    return this.create_child_view(model).then((view: DOMWidgetView) => {
      // replace the dummy widget with the new one.
      let i = ArrayExt.firstIndexOf(this.pWidget.widgets, dummy);
      this.pWidget.insertWidget(i, view.pWidget);
      dummy.dispose();
      return view;
    }).catch(reject('Could not add child view to box', true));
  }

  children_views: ViewList<DOMWidgetView> | null;
  pWidget: JupyterPhosphorPanelWidget;
  layout: any;
}
