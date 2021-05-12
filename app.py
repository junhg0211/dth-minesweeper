from os.path import isfile, join

from flask import Flask, render_template, send_file

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/easter/<name>')
def easter(name: str):
    return render_template('index.html', name=name)


@app.route('/src/<path:path>')
def src(path: str):
    path = join('templates', 'src', path)

    if isfile(path):
        return send_file(path)
    else:
        return '404 error', 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
