from flask import current_app as app

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