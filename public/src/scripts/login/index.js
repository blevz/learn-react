const React = require("react"),
    {Bootstrap, Grid, Col, Row, Button} = require('react-bootstrap'),
    {Link} = require('react-router'),
    {StickyRoute, ReactFireRoute, McFlyRoute, ButtonRoute, StaticsRoute, MarkdownRoute} = require('../routes'),
    Breadcrumbs = require('react-breadcrumbs'),
    McFly = require("mcfly"),
    Flux = new McFly(),
    LoginStore = require("./store"),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin;


const LoginActions = Flux.createActions({
    login: function (userName,passWord) {
        return {
            actionType: "LOGIN",
            userName: userName,
            passWord: passWord
        }
    }
});

const LoggedIn = React.createClass({
    mixins: [PureRenderMixin],

    render() {
        if (LoginStore.isAuthenticated()) {
            return <div>You are logged in!</div>
        }
        else {
            return <span />
        }
    }
});

const Instructions = React.createClass({
    mixins: [PureRenderMixin],

    render() {
            return <div>
                    <h3>Instructions</h3>
                <p>
                    Handling login in a pure JavaScript app (also called a
                    Single Page Application, or a SPA) can be quite tricky. In this example,
                    I'm going to log in through third party API and store
                    the credentials in my app using the flux pattern. I'm doing this in
                    React, but the principle applies no matter what kind of
                    JavaScript library you're using.
                </p>
                <p>
                    One thing to note is that the
                    API is configured to authenticate with Oauth2.
                </p>
                <blockquote>
                    OAuth 2.0 is the next evolution of the OAuth protocol which was
                    originally created in late 2006. OAuth 2.0 focuses on client
                    developer simplicity while providing specific authorization flows
                    for web applications, desktop applications, mobile phones,
                    and living room devices. Source: <a href="http://oauth.net/2/" target="_blank">ouath.net</a>
                </blockquote>
                <p>
                    In a regular server-based application I would have requested
                    access with a combination of the users login information coupled
                    with a secret client key, and then been given an authorization code
                    which I would have stored securely in a session.
                </p>
                <p>
                    In a browser-based application, this method is not secure, so instead
                    I'm going to use something that is known as an <em>implicit grant</em> to
                    request access.

                </p>
                <p>
                    This is similar to an authorization code, but rather
                    than an authorization code being returned from the
                    authorization request, a token is returned from the API.
                </p>
                <blockquote>
                    The implicit grant type is used to obtain access tokens and is
                    optimized for public clients known to operate a particular
                    redirection URI. These clients are typically implemented in a
                    browser using a scripting language such as JavaScript.

                    Unlike the authorization code grant type, in which the
                    client makes separate requests for authorization and for
                    an access token, the client receives the access token as
                    the result of the authorization request.
                    </blockquote>
                <p>
                    Here's what happens. When you click <em>Login</em>, a POST request is sent to a third-party service
                    located at https://morning-forest-9780.herokuapp.com/.
                </p>
                <p>
                    If the credentials are approved, the API
                    returns a couple of tokens in its response (an <em>access_token</em> and a <em>refresh_token</em>).
                </p>
                <p>
                    The use of tokens are important from a security point of view, because they contain
                    no login credentials and are only valid for a limited time.
                </p>
                <p>
                    When you receive these tokens, the flux store sets a <em>loggedIn</em> variable to
                    true, which means that you have an easy way of knowing whether your user is authenticated or not.
                    In this example, a call to the function <strong>LoginStore.isAuthenticated()</strong> is used
                    to display login information if the user is logged in.
                </p>
                <p>
                    As always, the source code is available on <a href="https://github.com/svenanders/learn-react">github</a>
                </p>

            </div>
    }
});

let timeoutArr=[];
module.exports = React.createClass({
    mixins: [LoginStore.mixin],

    storeDidChange: function () {
        this.setState({loggedIn: LoginStore.isAuthenticated()});
        if(!LoginStore.isAuthenticated())
        this.refs.myLoginLabel.getDOMNode().innerHTML = 'Login failed';
        else
            this.refs.myLoginLabel.getDOMNode().innerHTML = 'Login successful!';

        this.refs.myLoginButton.getDOMNode().disabled = false;

        for (var item of timeoutArr) {
            clearTimeout(item);
        }
    },
    login() {

        this.refs.myLoginLabel.getDOMNode().innerHTML = 'Logging in...';
        timeoutArr.push(setTimeout(()=>{
            this.refs.myLoginLabel.getDOMNode().innerHTML = 'Be patient...';
        },2e3));
        timeoutArr.push(setTimeout(()=>{
            this.refs.myLoginLabel.getDOMNode().innerHTML = 'Results are coming...';
        },4e3));
        timeoutArr.push(setTimeout(()=>{
            this.refs.myLoginLabel.getDOMNode().innerHTML = 'My, this is taking a long time isn\'t it?';
        },6e3));
        timeoutArr.push(setTimeout(()=>{
            this.refs.myLoginLabel.getDOMNode().innerHTML = 'Are you sure you\'re still connected to the net?';
        },8e3));
        timeoutArr.push(setTimeout(()=>{
            this.refs.myLoginLabel.getDOMNode().innerHTML = 'I\'m trying one last time...';
        },1e4));
        this.refs.myLoginButton.getDOMNode().disabled = true;
        let userName=this.refs.userName.getDOMNode().value;
        let passWord=this.refs.passWord.getDOMNode().value;

        if (LoginStore.isAuthenticated() === false)
            LoginActions.login(userName,passWord);
    },

    componentDidMount(){
        if (LoginStore.isAuthenticated() === false)
            this.refs.myLoginButton.getDOMNode().disabled = false;
    },

    displayName: route => {
        return `Home`;
    },

    exposeToken() {
        this.refs.myToken.getDOMNode().innerHTML = this.getToken();
    },

    getToken: () => {
        return 'undefined' !== typeof localStorage.getItem('auth.access_token') ?
            (localStorage.getItem('auth.access_token')) : false;
    },
    render() {
        var inlineCss = {
            padding: '10px 0 0 0 ',
            lineHeight: '16px',
            color: 'blue'
        };

        return <Grid className="flyin-widget">
            <Row className="show-grid">
                <Col md={12}>
                    <Breadcrumbs />
                        <p>
                            <b>Username:</b><br/>
                            <input ref="userName" type="text" defaultValue="marty" />
                        </p>
                        <p>
                            <b>Password:</b><br/>
                            <input ref="passWord" type="text" defaultValue="testpass" />
                        </p>

                        <Button ref="myLoginButton" bsStyle="success" bsSize="small" className="button" onClick={this.login}>
                            Login
                        </Button>
                        <p style={inlineCss}><span ref="myLoginLabel" />
                            <LoggedIn {...this.state} />
                        </p>
                    <Instructions />

                </Col>
            </Row>
        </Grid>
    }
});