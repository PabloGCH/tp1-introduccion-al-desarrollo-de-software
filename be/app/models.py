from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), unique=True, nullable=False)
    name = db.Column(db.String(40), nullable=False)
    surname = db.Column(db.String(40), nullable=False)
    image = db.Column(db.Text, nullable=True)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created = db.Column(db.DateTime, default=db.func.current_timestamp())
    last_login = db.Column(db.DateTime, default=db.func.current_timestamp())

    def set_password(self, password):
        self.password = generate_password_hash(password, method="pbkdf2:sha256")

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f"<User {self.username}>"

class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.Text, nullable=True)
    created = db.Column(db.DateTime, default=db.func.current_timestamp())
    owner = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    deletedAt = db.Column(db.DateTime, nullable=True)

    def getLikes(self):
        return Reaction.query.filter_by(post=self.id, type='like').count()

    def getDislikes(self):
        return Reaction.query.filter_by(post=self.id, type='dislike').count()

    def delete(self):
        self.deletedAt = db.func.current_timestamp()

    def __repr__(self):
        return f"<Post {self.title}>"

class Reaction(db.Model):
    __tablename__ = 'reaction'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(40), nullable=False)
    post = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def setType(self, type):
        self.type = type

    def __repr__(self):
        return f"<Reaction {self.type}>"

class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created = db.Column(db.DateTime, default=db.func.current_timestamp())
    post = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    owner = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    deletedAt = db.Column(db.DateTime, nullable=True)

    def delete(self):
        self.deletedAt = db.func.current_timestamp()

    def __repr__(self):
        return f"<Comment {self.content}>"

