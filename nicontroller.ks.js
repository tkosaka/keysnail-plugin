// PLUGIN INFO: {{{
var PLUGIN_INFO =
<KeySnailPlugin>
    <name>Controller for Niconico Douga</name>
    <name lang="ja">ニコニコ動画コントローラー</name>
    <description>Control Niconico Douga via KeySnail</description>
    <description lang="ja">ニコニコ動画をKeySnailから操作</description>
    <version>0.0.3</version>
    <updateURL>http://github.com/tkosaka/keysnail-plugin/raw/master/nicontroller.ks.js</updateURL>
    <iconURL></iconURL>
    <author mail="tomohiko.kosaka@gmail.com" homepage="http://tkosaka.blogspot.com/">Tomohiko KOSAKA</author>
    <license>New BSD License</license>
    <license lang="ja">New BSD License</license>
    <minVersion>1.0.8</minVersion>
    <include>main</include>
    <provides>
        <ext>nicoinfo</ext>
        <ext>nicopause</ext>
        <ext>nicomute</ext>
        <ext>nicommentvisible</ext>
        <ext>nicorepeat</ext>
        <ext>nicoseek</ext>
        <ext>nicoseekForward</ext>
        <ext>nicoseekBackward</ext>
        <ext>nicovolume</ext>
        <ext>nicovolumeIncrement</ext>
        <ext>nicovolumeDecrement</ext>
        <ext>nicosize</ext>
        <ext>nicodescription</ext>
        <ext>nicomment</ext>
        <ext>nicommand</ext>
     </provides>
    <options>
    </options>
    <detail><![CDATA[
=== Usage ===

        You can execute commands of nico* to manipulate the niconico player.
        See the above explanotions of each commands.
            
        Or, you can set keybinds to each commands. It is recommended to
        install site-local-keymap.ks.js and put them in the PRESERVE section in
        your init file.

>||
    local["http://(www|tw|es|de|)\.nicovideo\.jp\/watch/*"] = [
        ["i", function (ev, arg) { ext.exec("nicoinfo", arg); }],
        ["p", function (ev, arg) { ext.exec("nicopause", arg); }],
        ["m", function (ev, arg) { ext.exec("nicomute", arg); }],
        ["r", function (ev, arg) { ext.exec("nicorepeat", arg); }],
        ["z", function (ev, arg) { ext.exec("nicosize", arg); }],
        ["h", function (ev, arg) { ext.exec("nicommentvisible", arg); }],
        ["s", function (ev, arg) { ext.exec("nicoseekForward", arg); }],
        ["S", function (ev, arg) { ext.exec("nicoseekBackward", arg); }],
        [["v", "u"], function (ev, arg) { ext.exec("nicovolumeIncrement", arg); }],
        [["v", "d"], function (ev, arg) { ext.exec("nicovolumeDecrement", arg); }],
        [["V", "x"], function (ev) { ext.exec("nicovolume", 100); }],
        [["V", "h"], function (ev) { ext.exec("nicovolume", 50); }],
        ["c", function (ev, arg) { ext.exec("nicomment", arg); }],
        ["C", function (ev, arg) { ext.exec("nicommand", arg); }]
    ];
||<

        nicoseekForward, nicoseekBackward, nicovolumeIncrement and nicovolumeDecrement
        would be useful with a prefix argument
        e.g., C-u 10 s will seek forward by 10 sec.

=== Acknowledgement === 
            This plugin is a port of nicontroller.js for Vimperator.
            Thanks for janus_wel, the author of nicontroller.js.
=== Caveats ===
            nicomment and nicommand do not work under my environment Mac OSX, Firefox 3.5.5.
            These commands are waiting for your suggestions and modifications!
    ]]></detail>
    <detail lang="ja"><![CDATA[
=== Usage ===

        ニコニコプレイヤーの操作用にnico*で始まるエクステがあります。
        エクステについては上記の説明をご覧下さい。
            
        また、それぞれのエクステにキーをbindすることも出来ます。
        site-local-keymap.ks.jsをインストールして、
        initファイルのPRESERVE部分に下記を追加することをお勧めします。

>||
    local["http://(www|tw|es|de|)\.nicovideo\.jp\/watch/*"] = [
        ["i", function (ev, arg) { ext.exec("nicoinfo", arg); }],
        ["p", function (ev, arg) { ext.exec("nicopause", arg); }],
        ["m", function (ev, arg) { ext.exec("nicomute", arg); }],
        ["r", function (ev, arg) { ext.exec("nicorepeat", arg); }],
        ["z", function (ev, arg) { ext.exec("nicosize", arg); }],
        ["h", function (ev, arg) { ext.exec("nicommentvisible", arg); }],
        ["s", function (ev, arg) { ext.exec("nicoseekForward", arg); }],
        ["S", function (ev, arg) { ext.exec("nicoseekBackward", arg); }],
        [["v", "u"], function (ev, arg) { ext.exec("nicovolumeIncrement", arg); }],
        [["v", "d"], function (ev, arg) { ext.exec("nicovolumeDecrement", arg); }],
        [["V", "x"], function (ev) { ext.exec("nicovolume", 100); }],
        [["V", "h"], function (ev) { ext.exec("nicovolume", 50); }],
        ["c", function (ev, arg) { ext.exec("nicomment", arg); }],
        ["C", function (ev, arg) { ext.exec("nicommand", arg); }]
    ];
||<

        nicoseekForward, nicoseekBackward, nicovolumeIncrement,  nicovolumeDecrement
        は前置引数を付けて実行すると便利かも知れません
        e.g., C-u 10 s は10秒先にシークします。

=== 謝辞 ===
            このプラグインはVimperatorのプラグインのnicontroller.jsを移植したものです。
            nicontroller.jsの作者のjanus_welさんに感謝します。
=== 注意 ===
            nicommentとnicommandは当方の環境 Mac OSX, Firefox 3.5.5では動いていません。
            皆様のアイディアをお待ちしております。
]]></detail>
</KeySnailPlugin>;
// class definition
// cookie manager
function CookieManager() {
    this.initialize.apply(this, arguments);
}

CookieManager.prototype = {
    initialize: function (uri) {
        const Cc = Components.classes;
        const Ci = Components.interfaces;

        const MOZILLA = '@mozilla.org/';
        const IO_SERVICE = MOZILLA + 'network/io-service;1';
        const COOKIE_SERVICE = MOZILLA + 'cookieService;1';

        this.ioService = Cc[IO_SERVICE].getService(Ci.nsIIOService);
        this.cookieService = Cc[COOKIE_SERVICE].getService(Ci.nsICookieService);
        if(!this.ioService || !this.cookieService) {
            throw new Error('error on CookieManager initialize.');
        }

        this.readCookie(uri);
    },

    readCookie: function (uri) {
        if(uri) {
            this.uri = uri;
            this.uriObject = this.ioService.newURI(uri, null, null);
            this.cookie = this._deserializeCookie(this._getCookieString());
        }
    },

    _getCookieString: function () {
        return this.uriObject
            ? this.cookieService.getCookieString(this.uriObject, null)
            : null;
    },

    _setCookieString: function (cookieString) {
        if(this.uriObject && cookieString) {
            this.cookieService.setCookieString(this.uriObject, null, cookieString, null);
        }
    },

    _deserializeCookie: function (cookieString) {
        var cookies = cookieString.split('; ');
        var cookie = {};
        var key, val;
        for (let i=0, max=cookies.length ; i<max ; ++i) {
            [key, val] = cookies[i].split('=');
            cookie[key] = val;
        }
        return cookie;
    },

    getCookie: function (key) {
        return this.cookie[key] ? this.cookie[key] : null;
    },

    setCookie: function (obj) {
        this.cookie[obj.key] = obj.value;
        var string = [
            obj.key + '=' + obj.value,
            'domain=' + obj.domain,
            'expires=' + new Date(new Date().getTime() + obj.expires),
        ].join(';');
        this._setCookieString(string);
    },
};

// NicoPlayerController Class
function NicoPlayerController() {
    this.initialize.apply(this, arguments);
}
NicoPlayerController.prototype = {
    initialize: function () {
        this.cookieManager = new CookieManager();
    },

    constants: {
        VERSION:        '0.55',

        CARDINAL_NUMBER:    10,

        NICO_DOMAIN:    '.nicovideo.jp',
        NICO_URL:       'http://www.nicovideo.jp/',
        WATCH_URL:      '^http://[^.]+\.nicovideo\.jp/watch/',
        WATCH_PAGE:     1,

        FLVPLAYER_NODE_ID: 'flvplayer',

        STATE_PLAYING:  'playing',
        PLAY:           true,
        PAUSE:          false,

        STATE_SIZE_NORMAL:  'normal',
        STATE_SIZE_FIT:     'fit',

        NAME_PREMIUM_NO:     'premiumNo',
        NAME_PLAYER_VERSION: 'PLAYER_VERSION',

        SEEKTO_DEFAULT:     0,
        SEEKBY_DEFAULT:     0,
        VOLUMETO_DEFAULT:   100,
        VOLUMEBY_DEFAULT:   0,

        DESCRIPTION_HIDDEN_NODE_ID:    'des_1',
        DESCRIPTION_DISPLAYED_NODE_ID: 'des_2',

        DESCRIPTION_HIDDEN_STATE:       0,
        DESCRIPTION_DISPLAYED_STATE:    1,

        COOKIE_DESCRIPTION_NAME:    'desopen',
        COOKIE_EXPIRES:             60 * 60 * 24 * 365 * 1000,

        COMMAND_NORMAL: [
            ['naka',      'normal comment (flow right to left)'],
            ['ue',        'fix comment to vertical top and horizonal center of the screen'],
            ['shita',     'fix comment to vertical bottom and horizonal center of the screen'],
            ['medium',    'normal size comment'],
            ['big',       'big size comment'],
            ['small',     'small size comment'],
            ['white',     'white color comment'],
            ['red',       'red color comment'],
            ['pink',      'pink color comment'],
            ['orange',    'orange color comment'],
            ['yellow',    'yellow color comment'],
            ['green',     'green color comment'],
            ['cyan',      'cyan color comment'],
            ['blue',      'bule color comment'],
            ['purple',    'purple color comment'],
            ['184',       'anonymouse comment'],
            ['sage',      'post comment on "sage" mode'],
            ['invisible', 'invisible comment'],
        ],
        COMMAND_PREMIUM: [
            ['niconicowhite',  'nicinicowhite color comment'],
            ['truered',        'truered color comment'],
            ['passionorange',  'passionorange comment'],
            ['madyellow',      'madyellow comment'],
            ['elementalgreen', 'elementalgreen comment'],
            ['marineblue',     'marineblue'],
            ['nobleviolet',    'nobleviolet'],
            ['black',          'black'],
        ],
    },

    getControllerVersion: function () { return this.constants.VERSION; },
    getPlayerVersion: function () { return this.getValue(this.constants.NAME_PLAYER_VERSION); },

    pagecheck: function() {
        if(this.getURL().match(this.constants.WATCH_URL)) return this.constants.WATCH_PAGE;
        throw new Error('current tab is not watch page on nicovideo.jp');
    },

    // getURL: function() { return liberator.modules.buffer.URL; },
    getURL: function() { return window.content.location.href; },

    _flvplayer: function() {
        if(this.pagecheck() === this.constants.WATCH_PAGE) {
            let flvplayer = window.content.document.getElementById(this.constants.FLVPLAYER_NODE_ID);
            if(! flvplayer) throw new Error('flvplayer is not found');

            return flvplayer.wrappedJSObject || flvplayer;
        }
        return null;
    },

    togglePlay: function() {
        var p = this._flvplayer();
        (p.ext_getStatus() !== this.constants.STATE_PLAYING)
            ? p.ext_play(this.constants.PLAY)
            : p.ext_play(this.constants.PAUSE);

        if(p.ext_getStatus() === 'end') {
            let base = p.ext_getPlayheadTime();
            let self = this;
            setTimeout(function () {
                if (base !== p.ext_getPlayheadTime()) {
                    p.ext_play(self.constants.PAUSE);
                } else {
                    p.ext_setPlayheadTime(0);
                    p.ext_play(self.constants.PLAY);
                }
            }, 100);
        }
    },

    toggleMute: function() {
        var p = this._flvplayer();
        p.ext_setMute(! p.ext_isMute());
    },

    toggleCommentVisible: function() {
        var p = this._flvplayer();
        p.ext_setCommentVisible(! p.ext_isCommentVisible());
    },

    toggleRepeat: function() {
        var p = this._flvplayer();
        p.ext_setRepeat(! p.ext_isRepeat());
    },

    toggleSize: function() {
        var p = this._flvplayer();
        (p.ext_getVideoSize() === this.constants.STATE_SIZE_NORMAL)
            ? p.ext_setVideoSize(this.constants.STATE_SIZE_FIT)
            : p.ext_setVideoSize(this.constants.STATE_SIZE_NORMAL);
    },

    toggleDescription: function () {
        if(!(this.pagecheck() === this.constants.WATCH_PAGE)) {
            return;
        }

        // get nodes
        var hidden = window.content.document.getElementById(this.constants.DESCRIPTION_HIDDEN_NODE_ID);
        var displayed = window.content.document.getElementById(this.constants.DESCRIPTION_DISPLAYED_NODE_ID);

        // get cookie
        this.cookieManager.readCookie(this.constants.NICO_URL);
        var val = this.cookieManager.getCookie(this.constants.COOKIE_DESCRIPTION_NAME);

        if(!(hidden && displayed && val !== undefined && val !== null)) {
            return;
        }

        // change 'display' property of description nodes
        var escape = hidden.style.display;
        hidden.style.display = displayed.style.display;
        displayed.style.display = escape;

        // change cookie
        var change = (val == this.constants.DESCRIPTION_HIDDEN_STATE)
            ? this.constants.DESCRIPTION_DISPLAYED_STATE
            : this.constants.DESCRIPTION_HIDDEN_STATE;
        this.cookieManager.setCookie({
            key:     this.constants.COOKIE_DESCRIPTION_NAME,
            value:   change,
            domain:  this.constants.NICO_DOMAIN,
            expires: this.constants.COOKIE_EXPIRES,
        });
    },

    seekTo: function(position) {
        if(position) {
            if(position.match(/^(\d+):(\d+)$/)) {
                position = parseInt(RegExp.$1, this.constants.CARDINAL_NUMBER) * 60
                    + parseInt(RegExp.$2, this.constants.CARDINAL_NUMBER);
            }
            if(isNaN(position)) throw new Error('assign unsigned number : seekTo()');
        }
        else position = this.constants.SEEKTO_DEFAULT;

        var p = this._flvplayer();
        if (position < 0)
          p.ext_setPlayheadTime(parseInt(p.ext_getTotalTime()) + parseInt(position));
        else
          p.ext_setPlayheadTime(position);
    },

    seekBy: function(delta) {
        if(delta) {
            if(isNaN(delta)) throw new Error('assign signed number : seekBy()');
        }
        else delta = this.constants.SEEKBY_DEFAULT;

        var p = this._flvplayer();
        var position = p.ext_getPlayheadTime();
        position += parseInt(delta, this.constants.CARDINAL_NUMBER);

        p.ext_setPlayheadTime(position);
    },

    volumeTo: function(volume) {
        if(volume) {
            if(isNaN(volume)) throw new Error('assign unsigned number : volumeTo()');
        }
        else volume = this.constants.VOLUMETO_DEFAULT;

        var p = this._flvplayer();
        p.ext_setVolume(volume);
    },

    volumeBy: function(delta) {
        if(delta) {
            if(isNaN(delta)) throw new Error('assign signed number : volumeBy()');
        }
        else delta = this.constants.VOLUMEBY_DEFAULT;

        var p = this._flvplayer();
        var volume = p.ext_getVolume();
        volume += parseInt(delta, this.constants.CARDINAL_NUMBER);

        p.ext_setVolume(volume);
    },

    getValue: function(name) {
        return this._flvplayer().GetVariable(name);
    },

    setValue: function(name, value) {
        return this._flvplayer().SetVariable(name, value);
    },

    // return the clone not to damage
    // Array.apply() is cloning Array
    // (adding method to Array has a lot of troubles)
    // refer: http://la.ma.la/blog/diary_200510062243.htm
    getAvailableCommands: function() {
        return this.getValue(this.constants.NAME_PREMIUM_NO)
            ? this.constants.COMMAND_NORMAL.concat(this.constants.COMMAND_PREMIUM)
            : Array.apply(null, this.constants.COMMAND_NORMAL)
    }

};

// global object
var controller = new NicoPlayerController();

function nicoinfo () {
    try {
        let info = [
            'player version     : ' + controller.getPlayerVersion(),
            'controller version : ' + controller.getControllerVersion(),
        ].join("\n");
        display.echoStatusBar(info);
    }
    catch(e) { display.echoStatusBar(e); }
}

function nicopause () {
    try      { controller.togglePlay(); }
    catch(e) { display.echoStatusBar(e); }
}

function nicomute () {
    try      { controller.toggleMute(); }
    catch(e) { display.echoStatusBar(e); }
}

function nicommentvisible () {
    try      { controller.toggleCommentVisible(); }
    catch(e) { display.echoStatusBar(e); }
}

function nicorepeat () {
    try      { controller.toggleRepeat(); }
    catch(e) { display.echoStatusBar(e); }
}

function nicovolume (args) {
    try  {
        let arg = (args.length > 1)
            ? args[0].toString()
            : args.string;
        controller.volumeTo(arg);
    }
    catch(e) { display.echoStatusBar(e); }
}

function nicovolumeBy (arg) {
    try {
        controller.volumeBy(arg);
    }
    catch(e) { display.echoStatusBar(e); }
}

function nicovolumeIncrement (arg) {
    controller.volumeBy(+1);
}

function nicovolumeDecrement (arg) {
    controller.volumeBy(-1);
}

function nicosize () {
    try      { controller.toggleSize(); }
    catch(e) { display.echoStatusBar(e); }
}

function nicodescription () {
    try      { controller.toggleDescription(); }
    catch(e) { display.echoStatusBar(e); }
}

function nicomment0 (arg) {
    try {
        let command, comment;
        [command, comment] = expandExCommand(arg);
        
        comment = comment.replace(/&emsp;/g, EMSP)
            .replace(/&nbsp;/g, NBSP)
            .replace(/<LF>/g,   LF);
        
        if(command) {
            controller.setValue('inputArea.MailInput.text', command);
        }
        controller.setValue('ChatInput.text', comment);
    }
    catch(e) { display.echoStatusBar(e); }
}

function nicomment () {
    prompt.read("Comment: ", function (arg) {nicomment0 (arg);});
}

function nicommand0 (arg) {
    try      { controller.setValue('inputArea.MailInput.text', arg.string); }
    catch(e) { display.echoStatusBar(e); }
}

function nicommand () {
    prompt.read("Command: ", function (arg) {nicommand0 (arg);}, null,
                controller.getAvailableCommands(), null, 0, "nicommand_history");
}

function nicoseek (args) {
    try {
        let arg = (args.length > 1)
            ? args[0].toString()
            : args.string;
        nicoseekTo(arg);
    }
    catch(e) { display.echoStatusBar(e); }
}

function nicoseekBy (arg) {
    try {
        controller.seekBy(arg);
    }
    catch(e) { display.echoStatusBar(e); }
}

function nicoseekForward () {
    controller.seekBy(+1);
}

function nicoseekBackward () {
    nicoseekBy(-1);
}

// command register

ext.add("nicoinfo", nicoinfo,
        M({ja: 'プレイヤーの情報を表示します',
           en: 'Show player information'}));

ext.add("nicopause", nicopause,
        M({ja: '動画の再成・一時停止をトグルします',
           en: 'Toggle play/pause'}));

ext.add("nicomute", nicomute, 
        M({ja: 'ミュート状態をトグルします',
           en: 'Toggle mute'}));

ext.add("nicommentvisible", nicommentvisible, 
        M({ja: 'コメント表示をトグルします',
           en: 'Toggle comment visible'}));

ext.add("nicorepeat", nicorepeat, 
        M({ja: 'リピート再成をトグルします',
           en: 'Toggle repeat'}));

ext.add("nicoseek", nicoseek, 
        M({ja: 'シークバーをコントロールします',
           en: 'Control seek bar'}));

ext.add("nicoseekForward", nicoseekForward,
        M({ja: '動画を先方にシークします',
           en: 'Seek forward'}));

ext.add("nicoseekBackward", nicoseekBackward,
        M({ja: '動画を後方にシークします',
           en: 'Seek backward'}));

ext.add("nicovolume", nicovolume, 
        M({ja: 'Volumeを設定します',
           en: 'Control volume'}));

ext.add("nicovolumeIncrement", nicovolumeIncrement, 
        M({ja: 'Volumeを上げます',
           en: 'Increment volume'}));

ext.add("nicovolumeDecrement", nicovolumeDecrement, 
        M({ja: 'Volumeを下げます',
           en: 'Decrement volume'}));

ext.add("nicosize", nicosize, 
        M({ja: '動画のサイズをトグルします',
           en: 'Toggle video size'}));

ext.add("nicodescription", nicodescription, 
        M({ja: '動画の説明の表示をトグルします',
           en: 'Toggle expansion of the description for video'}));

ext.add("nicomment", nicomment, 
        M({ja: 'Fill comment box',
           en: 'Fill comment box'}));

ext.add("nicommand", nicommand, 
        M({ja: 'Fill command box',
           en: 'Fill command box'}));


// for ex-command -------------------------------------------------------
// constants
const MAX_LINE = {
    big:    16,
    medium: 25,
    small:  38,
};
const EMSP = '\u3000';
const NBSP = '\u00a0';
const LF = '\u000a';
const PROPATIES_DEFAULT = {
    fixFlag: false,
    max    : MAX_LINE['medium'],
    line   : 1,
    size   : '',
};
const COMMAND_SEPARATOR = '|';

// functions
function expandExCommand(arg) {
    var command, comment;

    // command and comment is separated by COMMAND_SEPARATOR
    var temp = arg.split(COMMAND_SEPARATOR);
    if(temp.length > 1) {
        command = temp.shift();
        comment = temp.join(COMMAND_SEPARATOR);
    }
    else {
        comment = arg;
    }

    // ex_command is putted in braces
    if(comment.match(/^\{([^{}]+)\}(.+)/)) {
        let exCommand = RegExp.$1;
        let text = RegExp.$2;

        let properties = analysisExCommand(exCommand);

        // fine tune command about comment size
        if(properties.size) {
            if(command) {
                command = command.replace(/\s*big\s*/g, ' ')
                                 .replace(/\s*medium\s*/g, ' ')
                                 .replace(/\s*small\s*/g, ' ');
            }
            command += ' ' + properties.size;
        }

        // expand!!
        comment = buildLineBreakString(properties.line) + text;
        if(properties.fixFlag) {
            let post = buildLineBreakString(properties.max - properties.line + 1);
            comment += post + NBSP;
        }
    }

    return [command, comment];
}

// "&nbsp;" and <LF> on each line
function buildLineBreakString(numof) {
    // faster than string concatenate (+, +=)
    var string = Array(numof * 2);
    for(let i=1 ; i<numof ; ++i) {
        string.push(NBSP);
        string.push(LF);
    }

    return string.join('');
}

// RegExp hell
function analysisExCommand(exCommand) {
    // default set
    var properties = PROPATIES_DEFAULT;

    // fix or not
    if(exCommand.match(/\bfix\b/)) {
        properties.fixFlag = true;
    }

    // comment size and max line
    if(exCommand.match(/\b(big|medium|small)\b/)) {
        properties.size = RegExp.$1;
        properties.max = MAX_LINE[properties.size];
    }
    else if(exCommand.match(/\bmax(\d+)\b/)) {
        properties.max = RegExp.$1;
    }

    // line
    if(exCommand.match(/\bline(-?\d+)\b/)) {
        let line = parseInt(RegExp.$1, 10);
        if(line < 0) line = properties.max + line + 1;
        if(line > properties.max) line = properties.max;
        properties.line = line;
    }

    return properties;
}