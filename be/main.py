from flask import Flask


app = Flask(__name__)

# VISTAS
# ================


@app.route('/')
def home():
    return 'Home'


@app.route('/login')
def loginView():
    return 'Login'


@app.route('/register')
def registerView():
    return 'Register'


@app.route('/profile')
def profileView():
    return 'Profile'


# API
# ================

@app.route('/api/login', methods=['POST'])
def login():
    return ''


@app.route('/api/register', methods=['POST'])
def register():
    return ''


@app.route('/api/profile/<userId>', methods=['GET'])
def getProfile():
    return ''


@app.route('/api/posts', methods=['GET'])
def getPost():
    return ''


@app.route('/api/post', methods=['POST'])
def createPost():
    return ''


@app.route('/api/post', methods=['DELETE'])
def deletePost():
    return ''


@app.route('/api/post', methods=['PUT'])
def updatePost():
    return ''


@app.route('/api/post/comment', methods=['POST'])
def createComment():
    return ''


if __name__ == '__main__':
    app.run()
