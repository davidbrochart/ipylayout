[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/davidbrochart/ipylayout/master?filepath=examples%2Fintroduction.ipynb)

# ipylayout

A Layout Manager Jupyter Widget Library based on [GoldenLayout](http://golden-layout.com).

## Installation

You can install using `pip`:

```bash
pip install ipylayout
```

Or if you use jupyterlab:

```bash
pip install ipylayout
jupyter labextension install @jupyter-widgets/jupyterlab-manager ipylayout
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] ipylayout
```
