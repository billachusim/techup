import { a as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { S as require_jsx_runtime } from "../@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../@floating-ui/react-dom+[...].mjs";
import { Buffer } from "node:buffer";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/domelementtype/lib/esm/index.js
/** Types of elements found in htmlparser2's DOM */
var ElementType;
(function(ElementType) {
	/** Type for the root element of a document */
	ElementType["Root"] = "root";
	/** Type for Text */
	ElementType["Text"] = "text";
	/** Type for <? ... ?> */
	ElementType["Directive"] = "directive";
	/** Type for <!-- ... --> */
	ElementType["Comment"] = "comment";
	/** Type for <script> tags */
	ElementType["Script"] = "script";
	/** Type for <style> tags */
	ElementType["Style"] = "style";
	/** Type for Any tag */
	ElementType["Tag"] = "tag";
	/** Type for <![CDATA[ ... ]]> */
	ElementType["CDATA"] = "cdata";
	/** Type for <!doctype ...> */
	ElementType["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
/**
* Tests whether an element is a tag or not.
*
* @param elem Element to test
*/
function isTag$1(elem) {
	return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
}
/** Type for the root element of a document */
var Root = ElementType.Root;
/** Type for Text */
var Text$1 = ElementType.Text;
/** Type for <? ... ?> */
var Directive = ElementType.Directive;
/** Type for <!-- ... --> */
var Comment$1 = ElementType.Comment;
/** Type for <script> tags */
var Script = ElementType.Script;
/** Type for <style> tags */
var Style = ElementType.Style;
/** Type for Any tag */
var Tag = ElementType.Tag;
/** Type for <![CDATA[ ... ]]> */
var CDATA$1 = ElementType.CDATA;
/** Type for <!doctype ...> */
var Doctype = ElementType.Doctype;
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/domhandler/lib/esm/node.js
/**
* This object will be used as the prototype for Nodes when creating a
* DOM-Level-1-compliant structure.
*/
var Node = class {
	constructor() {
		/** Parent of the node */
		this.parent = null;
		/** Previous sibling */
		this.prev = null;
		/** Next sibling */
		this.next = null;
		/** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
		this.startIndex = null;
		/** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
		this.endIndex = null;
	}
	/**
	* Same as {@link parent}.
	* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
	*/
	get parentNode() {
		return this.parent;
	}
	set parentNode(parent) {
		this.parent = parent;
	}
	/**
	* Same as {@link prev}.
	* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
	*/
	get previousSibling() {
		return this.prev;
	}
	set previousSibling(prev) {
		this.prev = prev;
	}
	/**
	* Same as {@link next}.
	* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
	*/
	get nextSibling() {
		return this.next;
	}
	set nextSibling(next) {
		this.next = next;
	}
	/**
	* Clone this node, and optionally its children.
	*
	* @param recursive Clone child nodes as well.
	* @returns A clone of the node.
	*/
	cloneNode(recursive = false) {
		return cloneNode(this, recursive);
	}
};
/**
* A node that contains some data.
*/
var DataNode = class extends Node {
	/**
	* @param data The content of the data node
	*/
	constructor(data) {
		super();
		this.data = data;
	}
	/**
	* Same as {@link data}.
	* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
	*/
	get nodeValue() {
		return this.data;
	}
	set nodeValue(data) {
		this.data = data;
	}
};
/**
* Text within the document.
*/
var Text = class extends DataNode {
	constructor() {
		super(...arguments);
		this.type = ElementType.Text;
	}
	get nodeType() {
		return 3;
	}
};
/**
* Comments within the document.
*/
var Comment = class extends DataNode {
	constructor() {
		super(...arguments);
		this.type = ElementType.Comment;
	}
	get nodeType() {
		return 8;
	}
};
/**
* Processing instructions, including doc types.
*/
var ProcessingInstruction = class extends DataNode {
	constructor(name, data) {
		super(data);
		this.name = name;
		this.type = ElementType.Directive;
	}
	get nodeType() {
		return 1;
	}
};
/**
* A `Node` that can have children.
*/
var NodeWithChildren = class extends Node {
	/**
	* @param children Children of the node. Only certain node types can have children.
	*/
	constructor(children) {
		super();
		this.children = children;
	}
	/** First child of the node. */
	get firstChild() {
		var _a;
		return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
	}
	/** Last child of the node. */
	get lastChild() {
		return this.children.length > 0 ? this.children[this.children.length - 1] : null;
	}
	/**
	* Same as {@link children}.
	* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
	*/
	get childNodes() {
		return this.children;
	}
	set childNodes(children) {
		this.children = children;
	}
};
var CDATA = class extends NodeWithChildren {
	constructor() {
		super(...arguments);
		this.type = ElementType.CDATA;
	}
	get nodeType() {
		return 4;
	}
};
/**
* The root node of the document.
*/
var Document = class extends NodeWithChildren {
	constructor() {
		super(...arguments);
		this.type = ElementType.Root;
	}
	get nodeType() {
		return 9;
	}
};
/**
* An element within the DOM.
*/
var Element = class extends NodeWithChildren {
	/**
	* @param name Name of the tag, eg. `div`, `span`.
	* @param attribs Object mapping attribute names to attribute values.
	* @param children Children of the node.
	*/
	constructor(name, attribs, children = [], type = name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag) {
		super(children);
		this.name = name;
		this.attribs = attribs;
		this.type = type;
	}
	get nodeType() {
		return 1;
	}
	/**
	* Same as {@link name}.
	* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
	*/
	get tagName() {
		return this.name;
	}
	set tagName(name) {
		this.name = name;
	}
	get attributes() {
		return Object.keys(this.attribs).map((name) => {
			var _a, _b;
			return {
				name,
				value: this.attribs[name],
				namespace: (_a = this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
				prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
			};
		});
	}
};
/**
* @param node Node to check.
* @returns `true` if the node is a `Element`, `false` otherwise.
*/
function isTag(node) {
	return isTag$1(node);
}
/**
* @param node Node to check.
* @returns `true` if the node has the type `CDATA`, `false` otherwise.
*/
function isCDATA(node) {
	return node.type === ElementType.CDATA;
}
/**
* @param node Node to check.
* @returns `true` if the node has the type `Text`, `false` otherwise.
*/
function isText(node) {
	return node.type === ElementType.Text;
}
/**
* @param node Node to check.
* @returns `true` if the node has the type `Comment`, `false` otherwise.
*/
function isComment(node) {
	return node.type === ElementType.Comment;
}
/**
* @param node Node to check.
* @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
*/
function isDirective(node) {
	return node.type === ElementType.Directive;
}
/**
* @param node Node to check.
* @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
*/
function isDocument(node) {
	return node.type === ElementType.Root;
}
/**
* Clone a node, and optionally its children.
*
* @param recursive Clone child nodes as well.
* @returns A clone of the node.
*/
function cloneNode(node, recursive = false) {
	let result;
	if (isText(node)) result = new Text(node.data);
	else if (isComment(node)) result = new Comment(node.data);
	else if (isTag(node)) {
		const children = recursive ? cloneChildren(node.children) : [];
		const clone = new Element(node.name, { ...node.attribs }, children);
		children.forEach((child) => child.parent = clone);
		if (node.namespace != null) clone.namespace = node.namespace;
		if (node["x-attribsNamespace"]) clone["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
		if (node["x-attribsPrefix"]) clone["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
		result = clone;
	} else if (isCDATA(node)) {
		const children = recursive ? cloneChildren(node.children) : [];
		const clone = new CDATA(children);
		children.forEach((child) => child.parent = clone);
		result = clone;
	} else if (isDocument(node)) {
		const children = recursive ? cloneChildren(node.children) : [];
		const clone = new Document(children);
		children.forEach((child) => child.parent = clone);
		if (node["x-mode"]) clone["x-mode"] = node["x-mode"];
		result = clone;
	} else if (isDirective(node)) {
		const instruction = new ProcessingInstruction(node.name, node.data);
		if (node["x-name"] != null) {
			instruction["x-name"] = node["x-name"];
			instruction["x-publicId"] = node["x-publicId"];
			instruction["x-systemId"] = node["x-systemId"];
		}
		result = instruction;
	} else throw new Error(`Not implemented yet: ${node.type}`);
	result.startIndex = node.startIndex;
	result.endIndex = node.endIndex;
	if (node.sourceCodeLocation != null) result.sourceCodeLocation = node.sourceCodeLocation;
	return result;
}
function cloneChildren(childs) {
	const children = childs.map((child) => cloneNode(child, true));
	for (let i = 1; i < children.length; i++) {
		children[i].prev = children[i - 1];
		children[i - 1].next = children[i];
	}
	return children;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/domhandler/lib/esm/index.js
var defaultOpts = {
	withStartIndices: false,
	withEndIndices: false,
	xmlMode: false
};
var DomHandler = class {
	/**
	* @param callback Called once parsing has completed.
	* @param options Settings for the handler.
	* @param elementCB Callback whenever a tag is closed.
	*/
	constructor(callback, options, elementCB) {
		/** The elements of the DOM */
		this.dom = [];
		/** The root element for the DOM */
		this.root = new Document(this.dom);
		/** Indicated whether parsing has been completed. */
		this.done = false;
		/** Stack of open tags. */
		this.tagStack = [this.root];
		/** A data node that is still being written to. */
		this.lastNode = null;
		/** Reference to the parser instance. Used for location information. */
		this.parser = null;
		if (typeof options === "function") {
			elementCB = options;
			options = defaultOpts;
		}
		if (typeof callback === "object") {
			options = callback;
			callback = void 0;
		}
		this.callback = callback !== null && callback !== void 0 ? callback : null;
		this.options = options !== null && options !== void 0 ? options : defaultOpts;
		this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
	}
	onparserinit(parser) {
		this.parser = parser;
	}
	onreset() {
		this.dom = [];
		this.root = new Document(this.dom);
		this.done = false;
		this.tagStack = [this.root];
		this.lastNode = null;
		this.parser = null;
	}
	onend() {
		if (this.done) return;
		this.done = true;
		this.parser = null;
		this.handleCallback(null);
	}
	onerror(error) {
		this.handleCallback(error);
	}
	onclosetag() {
		this.lastNode = null;
		const elem = this.tagStack.pop();
		if (this.options.withEndIndices) elem.endIndex = this.parser.endIndex;
		if (this.elementCB) this.elementCB(elem);
	}
	onopentag(name, attribs) {
		const element = new Element(name, attribs, void 0, this.options.xmlMode ? ElementType.Tag : void 0);
		this.addNode(element);
		this.tagStack.push(element);
	}
	ontext(data) {
		const { lastNode } = this;
		if (lastNode && lastNode.type === ElementType.Text) {
			lastNode.data += data;
			if (this.options.withEndIndices) lastNode.endIndex = this.parser.endIndex;
		} else {
			const node = new Text(data);
			this.addNode(node);
			this.lastNode = node;
		}
	}
	oncomment(data) {
		if (this.lastNode && this.lastNode.type === ElementType.Comment) {
			this.lastNode.data += data;
			return;
		}
		const node = new Comment(data);
		this.addNode(node);
		this.lastNode = node;
	}
	oncommentend() {
		this.lastNode = null;
	}
	oncdatastart() {
		const text = new Text("");
		const node = new CDATA([text]);
		this.addNode(node);
		text.parent = node;
		this.lastNode = text;
	}
	oncdataend() {
		this.lastNode = null;
	}
	onprocessinginstruction(name, data) {
		const node = new ProcessingInstruction(name, data);
		this.addNode(node);
	}
	handleCallback(error) {
		if (typeof this.callback === "function") this.callback(error, this.dom);
		else if (error) throw error;
	}
	addNode(node) {
		const parent = this.tagStack[this.tagStack.length - 1];
		const previousSibling = parent.children[parent.children.length - 1];
		if (this.options.withStartIndices) node.startIndex = this.parser.startIndex;
		if (this.options.withEndIndices) node.endIndex = this.parser.endIndex;
		parent.children.push(node);
		if (previousSibling) {
			node.prev = previousSibling;
			previousSibling.next = node;
		}
		node.parent = parent;
		this.lastNode = null;
	}
};
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/entities/lib/generated/decode-data-html.js
var require_decode_data_html = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map(function(c) {
		return c.charCodeAt(0);
	}));
}));
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/entities/lib/generated/decode-data-xml.js
var require_decode_data_xml = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map(function(c) {
		return c.charCodeAt(0);
	}));
}));
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/entities/lib/decode_codepoint.js
var require_decode_codepoint = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _a;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.replaceCodePoint = exports.fromCodePoint = void 0;
	var decodeMap = /* @__PURE__ */ new Map([
		[0, 65533],
		[128, 8364],
		[130, 8218],
		[131, 402],
		[132, 8222],
		[133, 8230],
		[134, 8224],
		[135, 8225],
		[136, 710],
		[137, 8240],
		[138, 352],
		[139, 8249],
		[140, 338],
		[142, 381],
		[145, 8216],
		[146, 8217],
		[147, 8220],
		[148, 8221],
		[149, 8226],
		[150, 8211],
		[151, 8212],
		[152, 732],
		[153, 8482],
		[154, 353],
		[155, 8250],
		[156, 339],
		[158, 382],
		[159, 376]
	]);
	/**
	* Polyfill for `String.fromCodePoint`. It is used to create a string from a Unicode code point.
	*/
	exports.fromCodePoint = (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
		var output = "";
		if (codePoint > 65535) {
			codePoint -= 65536;
			output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
			codePoint = 56320 | codePoint & 1023;
		}
		output += String.fromCharCode(codePoint);
		return output;
	};
	/**
	* Replace the given code point with a replacement character if it is a
	* surrogate or is outside the valid range. Otherwise return the code
	* point unchanged.
	*/
	function replaceCodePoint(codePoint) {
		var _a;
		if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
		return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
	}
	exports.replaceCodePoint = replaceCodePoint;
	/**
	* Replace the code point if relevant, then convert it to a string.
	*
	* @deprecated Use `fromCodePoint(replaceCodePoint(codePoint))` instead.
	* @param codePoint The code point to decode.
	* @returns The decoded code point.
	*/
	function decodeCodePoint(codePoint) {
		return (0, exports.fromCodePoint)(replaceCodePoint(codePoint));
	}
	exports.default = decodeCodePoint;
}));
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/entities/lib/decode.js
var require_decode = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decodeXML = exports.decodeHTMLStrict = exports.decodeHTMLAttribute = exports.decodeHTML = exports.determineBranch = exports.EntityDecoder = exports.DecodingMode = exports.BinTrieFlags = exports.fromCodePoint = exports.replaceCodePoint = exports.decodeCodePoint = exports.xmlDecodeTree = exports.htmlDecodeTree = void 0;
	var decode_data_html_js_1 = __importDefault(require_decode_data_html());
	exports.htmlDecodeTree = decode_data_html_js_1.default;
	var decode_data_xml_js_1 = __importDefault(require_decode_data_xml());
	exports.xmlDecodeTree = decode_data_xml_js_1.default;
	var decode_codepoint_js_1 = __importStar(require_decode_codepoint());
	exports.decodeCodePoint = decode_codepoint_js_1.default;
	var decode_codepoint_js_2 = require_decode_codepoint();
	Object.defineProperty(exports, "replaceCodePoint", {
		enumerable: true,
		get: function() {
			return decode_codepoint_js_2.replaceCodePoint;
		}
	});
	Object.defineProperty(exports, "fromCodePoint", {
		enumerable: true,
		get: function() {
			return decode_codepoint_js_2.fromCodePoint;
		}
	});
	var CharCodes;
	(function(CharCodes) {
		CharCodes[CharCodes["NUM"] = 35] = "NUM";
		CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
		CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
		CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
		CharCodes[CharCodes["NINE"] = 57] = "NINE";
		CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
		CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
		CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
		CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
		CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
		CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
		CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
	})(CharCodes || (CharCodes = {}));
	/** Bit that needs to be set to convert an upper case ASCII character to lower case */
	var TO_LOWER_BIT = 32;
	var BinTrieFlags;
	(function(BinTrieFlags) {
		BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
		BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
		BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
	})(BinTrieFlags = exports.BinTrieFlags || (exports.BinTrieFlags = {}));
	function isNumber(code) {
		return code >= CharCodes.ZERO && code <= CharCodes.NINE;
	}
	function isHexadecimalCharacter(code) {
		return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
	}
	function isAsciiAlphaNumeric(code) {
		return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
	}
	/**
	* Checks if the given character is a valid end character for an entity in an attribute.
	*
	* Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
	* See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
	*/
	function isEntityInAttributeInvalidEnd(code) {
		return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
	}
	var EntityDecoderState;
	(function(EntityDecoderState) {
		EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
		EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
		EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
		EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
		EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
	})(EntityDecoderState || (EntityDecoderState = {}));
	var DecodingMode;
	(function(DecodingMode) {
		/** Entities in text nodes that can end with any character. */
		DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
		/** Only allow entities terminated with a semicolon. */
		DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
		/** Entities in attributes have limitations on ending characters. */
		DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
	})(DecodingMode = exports.DecodingMode || (exports.DecodingMode = {}));
	/**
	* Token decoder with support of writing partial entities.
	*/
	var EntityDecoder = function() {
		function EntityDecoder(decodeTree, emitCodePoint, errors) {
			this.decodeTree = decodeTree;
			this.emitCodePoint = emitCodePoint;
			this.errors = errors;
			/** The current state of the decoder. */
			this.state = EntityDecoderState.EntityStart;
			/** Characters that were consumed while parsing an entity. */
			this.consumed = 1;
			/**
			* The result of the entity.
			*
			* Either the result index of a numeric entity, or the codepoint of a
			* numeric entity.
			*/
			this.result = 0;
			/** The current index in the decode tree. */
			this.treeIndex = 0;
			/** The number of characters that were consumed in excess. */
			this.excess = 1;
			/** The mode in which the decoder is operating. */
			this.decodeMode = DecodingMode.Strict;
		}
		/** Resets the instance to make it reusable. */
		EntityDecoder.prototype.startEntity = function(decodeMode) {
			this.decodeMode = decodeMode;
			this.state = EntityDecoderState.EntityStart;
			this.result = 0;
			this.treeIndex = 0;
			this.excess = 1;
			this.consumed = 1;
		};
		/**
		* Write an entity to the decoder. This can be called multiple times with partial entities.
		* If the entity is incomplete, the decoder will return -1.
		*
		* Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
		* entity is incomplete, and resume when the next string is written.
		*
		* @param string The string containing the entity (or a continuation of the entity).
		* @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		EntityDecoder.prototype.write = function(str, offset) {
			switch (this.state) {
				case EntityDecoderState.EntityStart:
					if (str.charCodeAt(offset) === CharCodes.NUM) {
						this.state = EntityDecoderState.NumericStart;
						this.consumed += 1;
						return this.stateNumericStart(str, offset + 1);
					}
					this.state = EntityDecoderState.NamedEntity;
					return this.stateNamedEntity(str, offset);
				case EntityDecoderState.NumericStart: return this.stateNumericStart(str, offset);
				case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(str, offset);
				case EntityDecoderState.NumericHex: return this.stateNumericHex(str, offset);
				case EntityDecoderState.NamedEntity: return this.stateNamedEntity(str, offset);
			}
		};
		/**
		* Switches between the numeric decimal and hexadecimal states.
		*
		* Equivalent to the `Numeric character reference state` in the HTML spec.
		*
		* @param str The string containing the entity (or a continuation of the entity).
		* @param offset The current offset.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		EntityDecoder.prototype.stateNumericStart = function(str, offset) {
			if (offset >= str.length) return -1;
			if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
				this.state = EntityDecoderState.NumericHex;
				this.consumed += 1;
				return this.stateNumericHex(str, offset + 1);
			}
			this.state = EntityDecoderState.NumericDecimal;
			return this.stateNumericDecimal(str, offset);
		};
		EntityDecoder.prototype.addToNumericResult = function(str, start, end, base) {
			if (start !== end) {
				var digitCount = end - start;
				this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
				this.consumed += digitCount;
			}
		};
		/**
		* Parses a hexadecimal numeric entity.
		*
		* Equivalent to the `Hexademical character reference state` in the HTML spec.
		*
		* @param str The string containing the entity (or a continuation of the entity).
		* @param offset The current offset.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		EntityDecoder.prototype.stateNumericHex = function(str, offset) {
			var startIdx = offset;
			while (offset < str.length) {
				var char = str.charCodeAt(offset);
				if (isNumber(char) || isHexadecimalCharacter(char)) offset += 1;
				else {
					this.addToNumericResult(str, startIdx, offset, 16);
					return this.emitNumericEntity(char, 3);
				}
			}
			this.addToNumericResult(str, startIdx, offset, 16);
			return -1;
		};
		/**
		* Parses a decimal numeric entity.
		*
		* Equivalent to the `Decimal character reference state` in the HTML spec.
		*
		* @param str The string containing the entity (or a continuation of the entity).
		* @param offset The current offset.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		EntityDecoder.prototype.stateNumericDecimal = function(str, offset) {
			var startIdx = offset;
			while (offset < str.length) {
				var char = str.charCodeAt(offset);
				if (isNumber(char)) offset += 1;
				else {
					this.addToNumericResult(str, startIdx, offset, 10);
					return this.emitNumericEntity(char, 2);
				}
			}
			this.addToNumericResult(str, startIdx, offset, 10);
			return -1;
		};
		/**
		* Validate and emit a numeric entity.
		*
		* Implements the logic from the `Hexademical character reference start
		* state` and `Numeric character reference end state` in the HTML spec.
		*
		* @param lastCp The last code point of the entity. Used to see if the
		*               entity was terminated with a semicolon.
		* @param expectedLength The minimum number of characters that should be
		*                       consumed. Used to validate that at least one digit
		*                       was consumed.
		* @returns The number of characters that were consumed.
		*/
		EntityDecoder.prototype.emitNumericEntity = function(lastCp, expectedLength) {
			var _a;
			if (this.consumed <= expectedLength) {
				(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
				return 0;
			}
			if (lastCp === CharCodes.SEMI) this.consumed += 1;
			else if (this.decodeMode === DecodingMode.Strict) return 0;
			this.emitCodePoint((0, decode_codepoint_js_1.replaceCodePoint)(this.result), this.consumed);
			if (this.errors) {
				if (lastCp !== CharCodes.SEMI) this.errors.missingSemicolonAfterCharacterReference();
				this.errors.validateNumericCharacterReference(this.result);
			}
			return this.consumed;
		};
		/**
		* Parses a named entity.
		*
		* Equivalent to the `Named character reference state` in the HTML spec.
		*
		* @param str The string containing the entity (or a continuation of the entity).
		* @param offset The current offset.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		EntityDecoder.prototype.stateNamedEntity = function(str, offset) {
			var decodeTree = this.decodeTree;
			var current = decodeTree[this.treeIndex];
			var valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			for (; offset < str.length; offset++, this.excess++) {
				var char = str.charCodeAt(offset);
				this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
				if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
				current = decodeTree[this.treeIndex];
				valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
				if (valueLength !== 0) {
					if (char === CharCodes.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
					if (this.decodeMode !== DecodingMode.Strict) {
						this.result = this.treeIndex;
						this.consumed += this.excess;
						this.excess = 0;
					}
				}
			}
			return -1;
		};
		/**
		* Emit a named entity that was not terminated with a semicolon.
		*
		* @returns The number of characters consumed.
		*/
		EntityDecoder.prototype.emitNotTerminatedNamedEntity = function() {
			var _a;
			var _b = this, result = _b.result;
			var valueLength = (_b.decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
			this.emitNamedEntityData(result, valueLength, this.consumed);
			(_a = this.errors) === null || _a === void 0 || _a.missingSemicolonAfterCharacterReference();
			return this.consumed;
		};
		/**
		* Emit a named entity.
		*
		* @param result The index of the entity in the decode tree.
		* @param valueLength The number of bytes in the entity.
		* @param consumed The number of characters consumed.
		*
		* @returns The number of characters consumed.
		*/
		EntityDecoder.prototype.emitNamedEntityData = function(result, valueLength, consumed) {
			var decodeTree = this.decodeTree;
			this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
			if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
			return consumed;
		};
		/**
		* Signal to the parser that the end of the input was reached.
		*
		* Remaining data will be emitted and relevant errors will be produced.
		*
		* @returns The number of characters consumed.
		*/
		EntityDecoder.prototype.end = function() {
			var _a;
			switch (this.state) {
				case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
				case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
				case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
				case EntityDecoderState.NumericStart:
					(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
					return 0;
				case EntityDecoderState.EntityStart: return 0;
			}
		};
		return EntityDecoder;
	}();
	exports.EntityDecoder = EntityDecoder;
	/**
	* Creates a function that decodes entities in a string.
	*
	* @param decodeTree The decode tree.
	* @returns A function that decodes entities in a string.
	*/
	function getDecoder(decodeTree) {
		var ret = "";
		var decoder = new EntityDecoder(decodeTree, function(str) {
			return ret += (0, decode_codepoint_js_1.fromCodePoint)(str);
		});
		return function decodeWithTrie(str, decodeMode) {
			var lastIndex = 0;
			var offset = 0;
			while ((offset = str.indexOf("&", offset)) >= 0) {
				ret += str.slice(lastIndex, offset);
				decoder.startEntity(decodeMode);
				var len = decoder.write(str, offset + 1);
				if (len < 0) {
					lastIndex = offset + decoder.end();
					break;
				}
				lastIndex = offset + len;
				offset = len === 0 ? lastIndex + 1 : lastIndex;
			}
			var result = ret + str.slice(lastIndex);
			ret = "";
			return result;
		};
	}
	/**
	* Determines the branch of the current node that is taken given the current
	* character. This function is used to traverse the trie.
	*
	* @param decodeTree The trie.
	* @param current The current node.
	* @param nodeIdx The index right after the current node and its value.
	* @param char The current character.
	* @returns The index of the next node, or -1 if no branch is taken.
	*/
	function determineBranch(decodeTree, current, nodeIdx, char) {
		var branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
		var jumpOffset = current & BinTrieFlags.JUMP_TABLE;
		if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
		if (jumpOffset) {
			var value = char - jumpOffset;
			return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
		}
		var lo = nodeIdx;
		var hi = lo + branchCount - 1;
		while (lo <= hi) {
			var mid = lo + hi >>> 1;
			var midVal = decodeTree[mid];
			if (midVal < char) lo = mid + 1;
			else if (midVal > char) hi = mid - 1;
			else return decodeTree[mid + branchCount];
		}
		return -1;
	}
	exports.determineBranch = determineBranch;
	var htmlDecoder = getDecoder(decode_data_html_js_1.default);
	var xmlDecoder = getDecoder(decode_data_xml_js_1.default);
	/**
	* Decodes an HTML string.
	*
	* @param str The string to decode.
	* @param mode The decoding mode.
	* @returns The decoded string.
	*/
	function decodeHTML(str, mode) {
		if (mode === void 0) mode = DecodingMode.Legacy;
		return htmlDecoder(str, mode);
	}
	exports.decodeHTML = decodeHTML;
	/**
	* Decodes an HTML string in an attribute.
	*
	* @param str The string to decode.
	* @returns The decoded string.
	*/
	function decodeHTMLAttribute(str) {
		return htmlDecoder(str, DecodingMode.Attribute);
	}
	exports.decodeHTMLAttribute = decodeHTMLAttribute;
	/**
	* Decodes an HTML string, requiring all entities to be terminated by a semicolon.
	*
	* @param str The string to decode.
	* @returns The decoded string.
	*/
	function decodeHTMLStrict(str) {
		return htmlDecoder(str, DecodingMode.Strict);
	}
	exports.decodeHTMLStrict = decodeHTMLStrict;
	/**
	* Decodes an XML string, requiring all entities to be terminated by a semicolon.
	*
	* @param str The string to decode.
	* @returns The decoded string.
	*/
	function decodeXML(str) {
		return xmlDecoder(str, DecodingMode.Strict);
	}
	exports.decodeXML = decodeXML;
}));
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/entities/lib/esm/escape.js
var xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
var xmlCodeMap = /* @__PURE__ */ new Map([
	[34, "&quot;"],
	[38, "&amp;"],
	[39, "&apos;"],
	[60, "&lt;"],
	[62, "&gt;"]
]);
var getCodePoint = String.prototype.codePointAt != null ? (str, index) => str.codePointAt(index) : (c, index) => (c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index);
/**
* Encodes all non-ASCII characters, as well as characters not valid in XML
* documents using XML entities.
*
* If a character has no equivalent entity, a
* numeric hexadecimal reference (eg. `&#xfc;`) will be used.
*/
function encodeXML(str) {
	let ret = "";
	let lastIdx = 0;
	let match;
	while ((match = xmlReplacer.exec(str)) !== null) {
		const i = match.index;
		const char = str.charCodeAt(i);
		const next = xmlCodeMap.get(char);
		if (next !== void 0) {
			ret += str.substring(lastIdx, i) + next;
			lastIdx = i + 1;
		} else {
			ret += `${str.substring(lastIdx, i)}&#x${getCodePoint(str, i).toString(16)};`;
			lastIdx = xmlReplacer.lastIndex += Number((char & 64512) === 55296);
		}
	}
	return ret + str.substr(lastIdx);
}
/**
* Creates a function that escapes all characters matched by the given regular
* expression using the given map of characters to escape to their entities.
*
* @param regex Regular expression to match characters to escape.
* @param map Map of characters to escape to their entities.
*
* @returns Function that escapes all characters matched by the given regular
* expression using the given map of characters to escape to their entities.
*/
function getEscaper(regex, map) {
	return function escape(data) {
		let match;
		let lastIdx = 0;
		let result = "";
		while (match = regex.exec(data)) {
			if (lastIdx !== match.index) result += data.substring(lastIdx, match.index);
			result += map.get(match[0].charCodeAt(0));
			lastIdx = match.index + 1;
		}
		return result + data.substring(lastIdx);
	};
}
/**
* Encodes all characters that have to be escaped in HTML attributes,
* following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
*
* @param data String to escape.
*/
var escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
	[34, "&quot;"],
	[38, "&amp;"],
	[160, "&nbsp;"]
]));
/**
* Encodes all characters that have to be escaped in HTML text,
* following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
*
* @param data String to escape.
*/
var escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
	[38, "&amp;"],
	[60, "&lt;"],
	[62, "&gt;"],
	[160, "&nbsp;"]
]));
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/dom-serializer/lib/esm/foreignNames.js
var elementNames = new Map([
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"glyphRef",
	"linearGradient",
	"radialGradient",
	"textPath"
].map((val) => [val.toLowerCase(), val]));
var attributeNames = new Map([
	"definitionURL",
	"attributeName",
	"attributeType",
	"baseFrequency",
	"baseProfile",
	"calcMode",
	"clipPathUnits",
	"diffuseConstant",
	"edgeMode",
	"filterUnits",
	"glyphRef",
	"gradientTransform",
	"gradientUnits",
	"kernelMatrix",
	"kernelUnitLength",
	"keyPoints",
	"keySplines",
	"keyTimes",
	"lengthAdjust",
	"limitingConeAngle",
	"markerHeight",
	"markerUnits",
	"markerWidth",
	"maskContentUnits",
	"maskUnits",
	"numOctaves",
	"pathLength",
	"patternContentUnits",
	"patternTransform",
	"patternUnits",
	"pointsAtX",
	"pointsAtY",
	"pointsAtZ",
	"preserveAlpha",
	"preserveAspectRatio",
	"primitiveUnits",
	"refX",
	"refY",
	"repeatCount",
	"repeatDur",
	"requiredExtensions",
	"requiredFeatures",
	"specularConstant",
	"specularExponent",
	"spreadMethod",
	"startOffset",
	"stdDeviation",
	"stitchTiles",
	"surfaceScale",
	"systemLanguage",
	"tableValues",
	"targetX",
	"targetY",
	"textLength",
	"viewBox",
	"viewTarget",
	"xChannelSelector",
	"yChannelSelector",
	"zoomAndPan"
].map((val) => [val.toLowerCase(), val]));
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/dom-serializer/lib/esm/index.js
/**
* Mixed-case SVG and MathML tags & attributes
* recognized by the HTML parser.
*
* @see https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign
*/
var unencodedElements = /* @__PURE__ */ new Set([
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
]);
function replaceQuotes(value) {
	return value.replace(/"/g, "&quot;");
}
/**
* Format attributes
*/
function formatAttributes(attributes, opts) {
	var _a;
	if (!attributes) return;
	const encode = ((_a = opts.encodeEntities) !== null && _a !== void 0 ? _a : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML : escapeAttribute;
	return Object.keys(attributes).map((key) => {
		var _a, _b;
		const value = (_a = attributes[key]) !== null && _a !== void 0 ? _a : "";
		if (opts.xmlMode === "foreign") key = (_b = attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
		if (!opts.emptyAttrs && !opts.xmlMode && value === "") return key;
		return `${key}="${encode(value)}"`;
	}).join(" ");
}
/**
* Self-enclosing tags
*/
var singleTag = /* @__PURE__ */ new Set([
	"area",
	"base",
	"basefont",
	"br",
	"col",
	"command",
	"embed",
	"frame",
	"hr",
	"img",
	"input",
	"isindex",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]);
/**
* Renders a DOM node or an array of DOM nodes to a string.
*
* Can be thought of as the equivalent of the `outerHTML` of the passed node(s).
*
* @param node Node to be rendered.
* @param options Changes serialization behavior
*/
function render$1(node, options = {}) {
	const nodes = "length" in node ? node : [node];
	let output = "";
	for (let i = 0; i < nodes.length; i++) output += renderNode(nodes[i], options);
	return output;
}
function renderNode(node, options) {
	switch (node.type) {
		case Root: return render$1(node.children, options);
		case Doctype:
		case Directive: return renderDirective(node);
		case Comment$1: return renderComment(node);
		case CDATA$1: return renderCdata(node);
		case Script:
		case Style:
		case Tag: return renderTag(node, options);
		case Text$1: return renderText(node, options);
	}
}
var foreignModeIntegrationPoints = /* @__PURE__ */ new Set([
	"mi",
	"mo",
	"mn",
	"ms",
	"mtext",
	"annotation-xml",
	"foreignObject",
	"desc",
	"title"
]);
var foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
function renderTag(elem, opts) {
	var _a;
	if (opts.xmlMode === "foreign") {
		elem.name = (_a = elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
		if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) opts = {
			...opts,
			xmlMode: false
		};
	}
	if (!opts.xmlMode && foreignElements.has(elem.name)) opts = {
		...opts,
		xmlMode: "foreign"
	};
	let tag = `<${elem.name}`;
	const attribs = formatAttributes(elem.attribs, opts);
	if (attribs) tag += ` ${attribs}`;
	if (elem.children.length === 0 && (opts.xmlMode ? opts.selfClosingTags !== false : opts.selfClosingTags && singleTag.has(elem.name))) {
		if (!opts.xmlMode) tag += " ";
		tag += "/>";
	} else {
		tag += ">";
		if (elem.children.length > 0) tag += render$1(elem.children, opts);
		if (opts.xmlMode || !singleTag.has(elem.name)) tag += `</${elem.name}>`;
	}
	return tag;
}
function renderDirective(elem) {
	return `<${elem.data}>`;
}
function renderText(elem, opts) {
	var _a;
	let data = elem.data || "";
	if (((_a = opts.encodeEntities) !== null && _a !== void 0 ? _a : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) data = opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML(data) : escapeText(data);
	return data;
}
function renderCdata(elem) {
	return `<![CDATA[${elem.children[0].data}]]>`;
}
function renderComment(elem) {
	return `<!--${elem.data}-->`;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/leac/lib/leac.mjs
var linebreaksRe = /\n/g;
function createPositionQuery(str) {
	const offsets = [...str.matchAll(linebreaksRe)].map((m) => m.index || 0);
	offsets.unshift(-1);
	let lineIndex = 1;
	return (offset) => {
		while (lineIndex > 1 && offset < offsets[lineIndex - 1]) lineIndex--;
		while (lineIndex < offsets.length && offset > offsets[lineIndex]) lineIndex++;
		return {
			line: lineIndex,
			column: offset - offsets[lineIndex - 1]
		};
	};
}
function toUnifiedRule(r, i) {
	return {
		name: r.name,
		discard: r.discard,
		push: r.push,
		pop: r.pop,
		regex: toRegExp(r, i),
		replacer: isReplacementRule(r) ? toReplacer(r.regex, r.replace) : void 0
	};
}
function isStringRule(r) {
	return Object.prototype.hasOwnProperty.call(r, "str");
}
function isRegexRule(r) {
	return Object.prototype.hasOwnProperty.call(r, "regex");
}
function isReplacementRule(r) {
	return Object.prototype.hasOwnProperty.call(r, "replace");
}
function toReplacer(re, replace) {
	const replaceSearch = toNonSticky(re);
	return (match) => match.replace(replaceSearch, replace);
}
function toRegExp(r, i) {
	if (r.name.length === 0) throw new Error(`Rule #${i} has empty name, which is not allowed.`);
	if (isRegexRule(r)) return toSticky(r.regex);
	if (isStringRule(r)) {
		if (r.str.length === 0) throw new Error(`Rule #${i} ("${r.name}") has empty "str" property, which is not allowed.`);
		return new RegExp(escapeRegExp(r.str), "y");
	}
	return new RegExp(escapeRegExp(r.name), "y");
}
function escapeRegExp(str) {
	return str.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, "\\$&");
}
function toSticky(re) {
	if (re.global) throw new Error(`Regular expression /${re.source}/${re.flags} contains the global flag, which is not allowed.`);
	return re.sticky ? re : new RegExp(re.source, re.flags + "y");
}
function toNonSticky(re) {
	return re.sticky ? new RegExp(re.source, re.flags.replace("y", "")) : re;
}
function createLexer(rules, state = "", options = {}) {
	const options1 = typeof state !== "string" ? state : options;
	const state1 = typeof state === "string" ? state : "";
	const unifiedRules = rules.map(toUnifiedRule);
	const isLineNumbers = !!options1.lineNumbers;
	return function(str, offset = 0) {
		const positionQuery = isLineNumbers ? createPositionQuery(str) : void 0;
		let position = {
			line: 0,
			column: 0
		};
		let currentIndex = offset;
		const tokens = [];
		loopStr: while (currentIndex < str.length) {
			let anyMatch = false;
			for (const rule of unifiedRules) {
				rule.regex.lastIndex = currentIndex;
				const match = rule.regex.exec(str);
				if (match && match[0].length > 0) {
					if (!rule.discard) {
						if (positionQuery) position = positionQuery(currentIndex);
						tokens.push({
							state: state1,
							name: rule.name,
							text: rule.replacer ? rule.replacer(match[0]) : match[0],
							offset: currentIndex,
							len: match[0].length,
							line: position.line,
							column: position.column
						});
					}
					currentIndex = rule.regex.lastIndex;
					anyMatch = true;
					if (rule.push) {
						const r = rule.push(str, currentIndex);
						tokens.push(...r.tokens);
						currentIndex = r.offset;
					}
					if (rule.pop) break loopStr;
					break;
				}
			}
			if (!anyMatch) break;
		}
		return {
			tokens,
			offset: currentIndex,
			complete: str.length <= currentIndex
		};
	};
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/peberminta/lib/core.mjs
function mapInner(r, f) {
	return r.matched ? {
		matched: true,
		position: r.position,
		value: f(r.value, r.position)
	} : r;
}
function mapOuter(r, f) {
	return r.matched ? f(r) : r;
}
function ab(pa, pb, join) {
	return (data, i) => mapOuter(pa(data, i), (ma) => mapInner(pb(data, ma.position), (vb, j) => join(ma.value, vb, data, i, j)));
}
function abc(pa, pb, pc, join) {
	return (data, i) => mapOuter(pa(data, i), (ma) => mapOuter(pb(data, ma.position), (mb) => mapInner(pc(data, mb.position), (vc, j) => join(ma.value, mb.value, vc, data, i, j))));
}
function ahead(p) {
	return (data, i) => mapOuter(p(data, i), (m1) => ({
		matched: true,
		position: i,
		value: m1.value
	}));
}
function all(...ps) {
	return (data, i) => {
		const result = [];
		let position = i;
		for (const p of ps) {
			const r1 = p(data, position);
			if (r1.matched) {
				result.push(r1.value);
				position = r1.position;
			} else return { matched: false };
		}
		return {
			matched: true,
			position,
			value: result
		};
	};
}
function chain(p, f) {
	return (data, i) => mapOuter(p(data, i), (m1) => f(m1.value, data, i, m1.position)(data, m1.position));
}
function chainReduce(acc, f) {
	return (data, i) => {
		let loop = true;
		let acc1 = acc;
		let pos = i;
		do {
			const r = f(acc1, data, pos)(data, pos);
			if (r.matched) {
				acc1 = r.value;
				pos = r.position;
			} else loop = false;
		} while (loop);
		return {
			matched: true,
			position: pos,
			value: acc1
		};
	};
}
function eitherOr(pa, pb) {
	return (data, i) => {
		const r1 = pa(data, i);
		return r1.matched ? r1 : pb(data, i);
	};
}
function error(message) {
	return (data, i) => {
		throw new Error(message instanceof Function ? message(data, i) : message);
	};
}
function first(...ps) {
	return (data, i) => {
		for (const p of ps) {
			const result = p(data, i);
			if (result.matched) return result;
		}
		return { matched: false };
	};
}
function map(p, mapper) {
	return (data, i) => mapInner(p(data, i), (v, j) => mapper(v, data, i, j));
}
function flatten1(p) {
	return map(p, (vs) => vs.flatMap((v) => v));
}
function flatten(...ps) {
	return flatten1(all(...ps));
}
function left(pa, pb) {
	return ab(pa, pb, (va) => va);
}
function reduceLeft(acc, p, reducer) {
	return chainReduce(acc, (acc) => map(p, (v, data, i, j) => reducer(acc, v, data, i, j)));
}
function leftAssoc2(pLeft, pOper, pRight) {
	return chain(pLeft, (v0) => reduceLeft(v0, ab(pOper, pRight, (f, y) => [f, y]), (acc, [f, y]) => f(acc, y)));
}
function takeWhile(p, test) {
	return (data, i) => {
		const values = [];
		let success = true;
		do {
			const r = p(data, i);
			if (r.matched && test(r.value, values.length + 1, data, i, r.position)) {
				values.push(r.value);
				i = r.position;
			} else success = false;
		} while (success);
		return {
			matched: true,
			position: i,
			value: values
		};
	};
}
function many(p) {
	return takeWhile(p, () => true);
}
function many1(p) {
	return ab(p, many(p), (head, tail) => [head, ...tail]);
}
function middle(pa, pb, pc) {
	return abc(pa, pb, pc, (ra, rb) => rb);
}
function not(p) {
	return (data, i) => {
		return p(data, i).matched ? { matched: false } : {
			matched: true,
			position: i,
			value: true
		};
	};
}
function option(p, def) {
	return (data, i) => {
		const r = p(data, i);
		return r.matched ? r : {
			matched: true,
			position: i,
			value: def
		};
	};
}
function recursive(f) {
	return function(data, i) {
		return f()(data, i);
	};
}
function right(pa, pb) {
	return ab(pa, pb, (va, vb) => vb);
}
function token$1(onToken, onEnd) {
	return (data, i) => {
		let position = i;
		let value = void 0;
		if (i < data.tokens.length) {
			value = onToken(data.tokens[i], data, i);
			if (value !== void 0) position++;
		} else onEnd?.(data, i);
		return value === void 0 ? { matched: false } : {
			matched: true,
			position,
			value
		};
	};
}
function filter(p, test) {
	return (data, i) => mapOuter(p(data, i), (m) => test(m.value, data, i, m.position) ? m : { matched: false });
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/parseley/lib/parseley.mjs
var ws = "(?:[ \\t\\r\\n\\f]*)";
var nl = "(?:\\n|\\r\\n|\\r|\\f)";
var nonascii = "[^\\x00-\\x7F]";
var unicode = "(?:\\\\[0-9a-f]{1,6}(?:\\r\\n|[ \\n\\r\\t\\f])?)";
var escape = "(?:\\\\[^\\n\\r\\f0-9a-f])";
var nmstart = `(?:[_a-z]|${nonascii}|${unicode}|${escape})`;
var nmchar = `(?:[_a-z0-9-]|${nonascii}|${unicode}|${escape})`;
var name = `(?:${nmchar}+)`;
var ident = `(?:[-]?${nmstart}${nmchar}*)`;
var string1 = `'([^\\n\\r\\f\\\\']|\\\\${nl}|${nonascii}|${unicode}|${escape})*'`;
var string2 = `"([^\\n\\r\\f\\\\"]|\\\\${nl}|${nonascii}|${unicode}|${escape})*"`;
var lexSelector = createLexer([
	{
		name: "ws",
		regex: new RegExp(ws)
	},
	{
		name: "hash",
		regex: new RegExp(`#${name}`, "i")
	},
	{
		name: "ident",
		regex: new RegExp(ident, "i")
	},
	{
		name: "str1",
		regex: new RegExp(string1, "i")
	},
	{
		name: "str2",
		regex: new RegExp(string2, "i")
	},
	{ name: "*" },
	{ name: "." },
	{ name: "," },
	{ name: "[" },
	{ name: "]" },
	{ name: "=" },
	{ name: ">" },
	{ name: "|" },
	{ name: "+" },
	{ name: "~" },
	{ name: "^" },
	{ name: "$" },
	{ name: ":" },
	{ name: "(" },
	{ name: ")" }
]);
var lexEscapedString = createLexer([
	{
		name: "unicode",
		regex: new RegExp(unicode, "i")
	},
	{
		name: "escape",
		regex: new RegExp(escape, "i")
	},
	{
		name: "any",
		regex: /* @__PURE__ */ new RegExp("[\\s\\S]", "i")
	}
]);
function sumSpec([a0, a1, a2], [b0, b1, b2]) {
	return [
		a0 + b0,
		a1 + b1,
		a2 + b2
	];
}
function sumAllSpec(ss) {
	return ss.reduce(sumSpec, [
		0,
		0,
		0
	]);
}
function maxSpec([a0, a1, a2], [b0, b1, b2]) {
	return a0 > b0 || a0 === b0 && (a1 > b1 || a1 === b1 && a2 >= b2) ? [
		a0,
		a1,
		a2
	] : [
		b0,
		b1,
		b2
	];
}
function maxAllSpec(ss) {
	return ss.reduce(maxSpec, [
		0,
		0,
		0
	]);
}
var escapedString_ = map(many(first(token$1((t) => t.name === "unicode" ? String.fromCodePoint(parseInt(t.text.slice(1), 16)) : void 0), token$1((t) => t.name === "escape" ? t.text.slice(1) : void 0), token$1((t) => t.name === "any" ? t.text : void 0))), (cs) => cs.join(""));
function unescape(escapedString) {
	return escapedString_({
		tokens: lexEscapedString(escapedString).tokens,
		options: void 0
	}, 0).value;
}
function literal(name) {
	return token$1((t) => t.name === name ? true : void 0);
}
var whitespace_ = token$1((t) => t.name === "ws" ? null : void 0);
var optionalWhitespace_ = option(whitespace_, null);
function optionallySpaced(parser) {
	return middle(optionalWhitespace_, parser, optionalWhitespace_);
}
var identifier_ = token$1((t) => t.name === "ident" ? unescape(t.text) : void 0);
var hashId_ = token$1((t) => t.name === "hash" ? unescape(t.text.slice(1)) : void 0);
var string_ = token$1((t) => t.name.startsWith("str") ? unescape(t.text.slice(1, -1)) : void 0);
var namespace_ = left(option(identifier_, ""), literal("|"));
var qualifiedName_ = eitherOr(ab(namespace_, identifier_, (ns, name) => ({
	name,
	namespace: ns
})), map(identifier_, (name) => ({
	name,
	namespace: null
})));
var uniSelector_ = eitherOr(ab(namespace_, literal("*"), (ns) => ({
	type: "universal",
	namespace: ns,
	specificity: [
		0,
		0,
		0
	]
})), map(literal("*"), () => ({
	type: "universal",
	namespace: null,
	specificity: [
		0,
		0,
		0
	]
})));
var tagSelector_ = map(qualifiedName_, ({ name, namespace }) => ({
	type: "tag",
	name,
	namespace,
	specificity: [
		0,
		0,
		1
	]
}));
var classSelector_ = ab(literal("."), identifier_, (_fullstop, name) => ({
	type: "class",
	name,
	specificity: [
		0,
		1,
		0
	]
}));
var idSelector_ = map(hashId_, (name) => ({
	type: "id",
	name,
	specificity: [
		1,
		0,
		0
	]
}));
var attrModifier_ = token$1((t) => {
	if (t.name === "ident") {
		if (t.text === "i" || t.text === "I") return "i";
		if (t.text === "s" || t.text === "S") return "s";
	}
});
var attrValue_ = eitherOr(ab(string_, option(right(optionalWhitespace_, attrModifier_), null), (v, mod) => ({
	value: v,
	modifier: mod
})), ab(identifier_, option(right(whitespace_, attrModifier_), null), (v, mod) => ({
	value: v,
	modifier: mod
})));
var attrMatcher_ = first(map(literal("="), () => "="), ab(literal("~"), literal("="), () => "~="), ab(literal("|"), literal("="), () => "|="), ab(literal("^"), literal("="), () => "^="), ab(literal("$"), literal("="), () => "$="), ab(literal("*"), literal("="), () => "*="));
var attrPresenceSelector_ = abc(literal("["), optionallySpaced(qualifiedName_), literal("]"), (_lbr, { name, namespace }) => ({
	type: "attrPresence",
	name,
	namespace,
	specificity: [
		0,
		1,
		0
	]
}));
var attrValueSelector_ = middle(literal("["), abc(optionallySpaced(qualifiedName_), attrMatcher_, optionallySpaced(attrValue_), ({ name, namespace }, matcher, { value, modifier }) => ({
	type: "attrValue",
	name,
	namespace,
	matcher,
	value,
	modifier,
	specificity: [
		0,
		1,
		0
	]
})), literal("]"));
var pseudoClassSelector_ = abc(literal(":"), identifier_, not(ahead(literal("("))), (_fullstop, name) => ({
	type: "pc",
	name,
	specificity: [
		0,
		1,
		0
	]
}));
function pcLiteral(name) {
	return filter(identifier_, (id) => id.toLowerCase() === name.toLowerCase());
}
function fpcBase(name, contentParser, contentDesc) {
	return abc(middle(literal(":"), pcLiteral(name), eitherOr(literal("("), error(`Expected opening parenthesis in :${name}()`))), eitherOr(optionallySpaced(contentParser), error(`Expected ${contentDesc} in :${name}()`)), eitherOr(literal(")"), error(`Expected closing parenthesis in :${name}()`)), (name, content) => ({
		name,
		content
	}));
}
var functionalPseudoClassSelector_ = first(map(fpcBase("is", recursive(() => listSelector_), "selector list"), (v) => ({
	type: "fpc:is",
	name: v.name,
	list: v.content.list,
	specificity: maxAllSpec(v.content.list.map((s) => s.specificity))
})), map(fpcBase("where", recursive(() => listSelector_), "selector list"), (v) => ({
	type: "fpc:where",
	name: v.name,
	list: v.content.list,
	specificity: [
		0,
		0,
		0
	]
})), map(fpcBase("not", recursive(() => listSelector_), "selector list"), (v) => ({
	type: "fpc:not",
	name: v.name,
	list: v.content.list,
	specificity: maxAllSpec(v.content.list.map((s) => s.specificity))
})));
var attrSelector_ = eitherOr(attrPresenceSelector_, attrValueSelector_);
var typeSelector_ = eitherOr(uniSelector_, tagSelector_);
var subclassSelector_ = first(idSelector_, classSelector_, attrSelector_, functionalPseudoClassSelector_, pseudoClassSelector_);
var compoundSelector_ = map(eitherOr(flatten(typeSelector_, many(subclassSelector_)), many1(subclassSelector_)), (ss) => {
	return {
		type: "compound",
		list: ss,
		specificity: sumAllSpec(ss.map((s) => s.specificity))
	};
});
var complexSelector_ = leftAssoc2(compoundSelector_, map(eitherOr(optionallySpaced(first(map(literal(">"), () => ">"), map(literal("+"), () => "+"), map(literal("~"), () => "~"), ab(literal("|"), literal("|"), () => "||"))), map(whitespace_, () => " ")), (c) => (left, right) => ({
	type: "compound",
	list: [...right.list, {
		type: "combinator",
		combinator: c,
		left,
		specificity: left.specificity
	}],
	specificity: sumSpec(left.specificity, right.specificity)
})), compoundSelector_);
var listSelector_ = leftAssoc2(map(complexSelector_, (s) => ({
	type: "list",
	list: [s]
})), map(optionallySpaced(literal(",")), () => (acc, next) => ({
	type: "list",
	list: [...acc.list, next]
})), complexSelector_);
function parse_(parser, str) {
	if (!(typeof str === "string" || str instanceof String)) throw new Error("Expected a selector string. Actual input is not a string!");
	const lexerResult = lexSelector(str);
	if (!lexerResult.complete) throw new Error(`The input "${str}" was only partially tokenized, stopped at offset ${lexerResult.offset}!\n` + prettyPrintPosition(str, lexerResult.offset));
	const result = optionallySpaced(parser)({
		tokens: lexerResult.tokens,
		options: void 0
	}, 0);
	if (!result.matched) throw new Error(`No match for "${str}" input!`);
	if (result.position < lexerResult.tokens.length) {
		const token = lexerResult.tokens[result.position];
		throw new Error(`The input "${str}" was only partially parsed, stopped at offset ${token.offset}!\n` + prettyPrintPosition(str, token.offset, token.len));
	}
	return result.value;
}
function prettyPrintPosition(str, offset, len = 1) {
	return `${str.replace(/(\t)|(\r)|(\n)/g, (_m, t, r) => t ? "␉" : r ? "␍" : "␊")}\n${"".padEnd(offset)}${"^".repeat(len)}`;
}
function parse1(str) {
	return parse_(complexSelector_, str);
}
function serialize(selector) {
	if (!selector.type) throw new Error("This is not an AST node.");
	switch (selector.type) {
		case "universal": return _serNs(selector.namespace) + "*";
		case "tag": return _serNs(selector.namespace) + _serIdent(selector.name);
		case "class": return "." + _serIdent(selector.name);
		case "id": return "#" + _serIdent(selector.name);
		case "attrPresence": return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}]`;
		case "attrValue": return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}${selector.matcher}"${_serStr(selector.value)}"${selector.modifier ? selector.modifier : ""}]`;
		case "pc": return ":" + _serIdent(selector.name);
		case "fpc:is":
		case "fpc:where":
		case "fpc:not": return `:${_serIdent(selector.name)}(${selector.list.map(serialize).join(",")})`;
		case "combinator": return serialize(selector.left) + selector.combinator;
		case "compound": return selector.list.reduce((acc, node) => {
			return node.type === "combinator" ? serialize(node) + acc : acc + serialize(node);
		}, "");
		case "list": return selector.list.map(serialize).join(",");
	}
}
function _serNs(ns) {
	return ns || ns === "" ? _serIdent(ns) + "|" : "";
}
function _codePoint(char) {
	return `\\${char.codePointAt(0).toString(16)} `;
}
function _serIdent(str) {
	return str.replace(/(^[0-9])|(^-[0-9])|(^-$)|([-0-9a-zA-Z_]|[^\x00-\x7F])|(\x00)|([\x01-\x1f]|\x7f)|([\s\S])/g, (_m, d1, d2, hy, safe, nl, ctrl, other) => d1 ? _codePoint(d1) : d2 ? "-" + _codePoint(d2.slice(1)) : hy ? "\\-" : safe ? safe : nl ? "�" : ctrl ? _codePoint(ctrl) : "\\" + other);
}
function _serStr(str) {
	return str.replace(/(")|(\\)|(\x00)|([\x01-\x1f]|\x7f)/g, (_m, dq, bs, nl, ctrl) => dq ? "\\\"" : bs ? "\\\\" : nl ? "�" : _codePoint(ctrl));
}
function normalize(selector, options = { mode: "html" }) {
	const isHtmlMode = (options.mode ?? "html") === "html";
	const allowUnspecifiedCaseSensitivityForAttributes = options.allowUnspecifiedCaseSensitivityForAttributes ?? false;
	const attributesWithNormalizedValues = options.attributesWithNormalizedValues;
	const attributesWithNormalizedValuesSet = attributesWithNormalizedValues?.length ? new Set(attributesWithNormalizedValues.map((a) => a.toLowerCase())) : null;
	function visit(node) {
		if (!node.type) throw new Error("This is not an AST node.");
		switch (node.type) {
			case "universal":
				if (isHtmlMode && node.namespace !== null) node.namespace = node.namespace.toLowerCase();
				break;
			case "tag":
				if (isHtmlMode) node.name = node.name.toLowerCase();
				if (isHtmlMode && node.namespace !== null) node.namespace = node.namespace.toLowerCase();
				break;
			case "attrPresence":
				if (isHtmlMode) node.name = node.name.toLowerCase();
				if (isHtmlMode && node.namespace !== null) node.namespace = node.namespace.toLowerCase();
				break;
			case "attrValue": {
				if (isHtmlMode) node.name = node.name.toLowerCase();
				if (isHtmlMode && node.namespace !== null) node.namespace = node.namespace.toLowerCase();
				const isCaseInsensitiveValue = node.modifier === "i" || node.modifier === null && !!attributesWithNormalizedValuesSet && attributesWithNormalizedValuesSet.has(node.name.toLowerCase());
				if (isCaseInsensitiveValue) node.value = node.value.toLowerCase();
				if (!allowUnspecifiedCaseSensitivityForAttributes && node.modifier === null) node.modifier = isCaseInsensitiveValue ? "i" : "s";
				break;
			}
			case "pc":
				node.name = node.name.toLowerCase();
				break;
			case "fpc:is":
			case "fpc:where":
			case "fpc:not":
				node.name = node.name.toLowerCase();
				node.list.forEach(visit);
				node.list.sort((a, b) => serialize(a) < serialize(b) ? -1 : 1);
				break;
			case "compound":
				node.list.forEach(visit);
				node.list.sort((a, b) => _compareSelectorPriority(_getSelectorPriority(a), _getSelectorPriority(b)));
				break;
			case "combinator":
				visit(node.left);
				break;
			case "list":
				node.list.forEach(visit);
				node.list.sort((a, b) => serialize(a) < serialize(b) ? -1 : 1);
		}
	}
	visit(selector);
	return selector;
}
function _getSelectorPriority(selector) {
	switch (selector.type) {
		case "universal": return [1];
		case "tag": return [1];
		case "id": return [2];
		case "class": return [3, selector.name];
		case "attrPresence": return [4, serialize(selector)];
		case "attrValue": return [5, serialize(selector)];
		case "pc": return [6, selector.name];
		case "fpc:is":
		case "fpc:where":
		case "fpc:not": return [7, serialize(selector)];
		case "combinator": return [15, serialize(selector)];
	}
}
function _compareSelectorPriority(a, b) {
	if (a[0] !== b[0]) return a[0] < b[0] ? -1 : 1;
	const aStr = a[1];
	const bStr = b[1];
	if (aStr === bStr) return 0;
	if (aStr === void 0) return -1;
	if (bStr === void 0) return 1;
	return aStr < bStr ? -1 : 1;
}
function compareSpecificity(a, b) {
	if (a[0] !== b[0]) return a[0] < b[0] ? -1 : 1;
	if (a[1] !== b[1]) return a[1] < b[1] ? -1 : 1;
	return a[2] < b[2] ? -1 : a[2] > b[2] ? 1 : 0;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/selderee/lib/selderee.mjs
var DecisionTree = class {
	branches;
	constructor(input, options = {}) {
		this.branches = weave(toAstTerminalPairs(input, options));
	}
	build(builder) {
		return builder(this.branches);
	}
};
function toAstTerminalPairs(array, options) {
	const len = array.length;
	const results = new Array(len);
	for (let i = 0; i < len; i++) {
		const [selectorString, val] = array[i];
		const ast = parse1(selectorString);
		reduceSelectorVariants(ast);
		normalize(ast, {
			mode: "html",
			attributesWithNormalizedValues: options.attributesWithNormalizedValues ?? [],
			allowUnspecifiedCaseSensitivityForAttributes: false
		});
		results[i] = {
			ast,
			terminal: {
				type: "terminal",
				valueContainer: {
					index: i,
					value: val,
					specificity: ast.specificity
				}
			}
		};
	}
	return results;
}
function reduceSelectorVariants(ast) {
	const newList = [];
	ast.list.forEach((sel) => {
		switch (sel.type) {
			case "class":
				newList.push({
					matcher: "~=",
					modifier: null,
					name: "class",
					namespace: null,
					specificity: sel.specificity,
					type: "attrValue",
					value: sel.name
				});
				break;
			case "id":
				newList.push({
					matcher: "=",
					modifier: null,
					name: "id",
					namespace: null,
					specificity: [
						0,
						1,
						0
					],
					type: "attrValue",
					value: sel.name
				});
				break;
			case "combinator":
				reduceSelectorVariants(sel.left);
				newList.push(sel);
				break;
			case "universal": break;
			default: newList.push(sel);
		}
	});
	ast.list = newList;
}
function weave(items) {
	const branches = [];
	while (items.length) {
		const topKind = findTopKey(items, (_sel) => true, getSelectorKind);
		const { matches, nonMatches, empty } = breakByKind(items, topKind);
		items = nonMatches;
		if (matches.length) branches.push(branchOfKind(topKind, matches));
		if (empty.length) branches.push(...terminate(empty));
	}
	return branches;
}
function terminate(items) {
	const results = [];
	for (const item of items) {
		const terminal = item.terminal;
		if (terminal.type === "terminal") results.push(terminal);
		else {
			const { matches, rest } = partition(terminal.cont, (node) => node.type === "terminal");
			matches.forEach((node) => results.push(node));
			if (rest.length) {
				terminal.cont = rest;
				results.push(terminal);
			}
		}
	}
	return results;
}
function breakByKind(items, selectedKind) {
	const matches = [];
	const nonMatches = [];
	const empty = [];
	for (const item of items) {
		const simpleSelectors = item.ast.list;
		if (simpleSelectors.length) (simpleSelectors.some((node) => getSelectorKind(node) === selectedKind) ? matches : nonMatches).push(item);
		else empty.push(item);
	}
	return {
		matches,
		nonMatches,
		empty
	};
}
function getSelectorKind(sel) {
	switch (sel.type) {
		case "attrPresence": return `attrPresence ${sel.name}`;
		case "attrValue": return `attrValue ${sel.name}`;
		case "pc": return `pc ${sel.name}`;
		case "combinator": return `combinator ${sel.combinator}`;
		default: return sel.type;
	}
}
function branchOfKind(kind, items) {
	if (kind === "tag") return tagNameBranch(items);
	if (kind.startsWith("attrValue ")) return attrValueBranch(kind.substring(10), items);
	if (kind.startsWith("attrPresence ")) return attrPresenceBranch(kind.substring(13), items);
	if (kind.startsWith("pc ")) return pseudoClassBranch(kind.substring(3), items);
	if (kind === "combinator >") return combinatorBranch(">", items);
	if (kind === "combinator +") return combinatorBranch("+", items);
	throw new Error(`Unsupported selector kind: ${kind}`);
}
function tagNameBranch(items) {
	const groups = spliceAndGroup(items, (x) => x.type === "tag", (x) => x.name);
	return {
		type: "tagName",
		variants: Object.entries(groups).map(([name, group]) => ({
			type: "variant",
			value: name,
			cont: weave(group.items)
		}))
	};
}
function attrPresenceBranch(name, items) {
	for (const item of items) spliceSimpleSelector(item, (x) => x.type === "attrPresence" && x.name === name);
	return {
		type: "attrPresence",
		name,
		cont: weave(items)
	};
}
function attrValueBranch(name, items) {
	const groups = spliceAndGroup(items, (x) => x.type === "attrValue" && x.name === name, (x) => `${x.matcher} ${x.modifier || ""} ${x.value}`);
	const matchers = [];
	for (const group of Object.values(groups)) {
		const sel = group.oneSimpleSelector;
		matchers.push({
			type: "matcher",
			matcher: sel.matcher,
			modifier: sel.modifier,
			value: sel.value,
			predicate: getAttrValuePredicate(sel),
			cont: weave(group.items)
		});
	}
	return {
		type: "attrValue",
		name,
		matchers
	};
}
function getAttrValuePredicate(sel) {
	if (sel.modifier === "i") {
		const expected = sel.value.toLowerCase();
		switch (sel.matcher) {
			case "=": return (actual) => expected === actual.toLowerCase();
			case "~=": return (actual) => actual.toLowerCase().split(/[ \t]+/).includes(expected);
			case "^=": return (actual) => actual.toLowerCase().startsWith(expected);
			case "$=": return (actual) => actual.toLowerCase().endsWith(expected);
			case "*=": return (actual) => actual.toLowerCase().includes(expected);
			case "|=": return (actual) => {
				const lower = actual.toLowerCase();
				return expected === lower || lower.startsWith(expected) && lower[expected.length] === "-";
			};
		}
	} else {
		const expected = sel.value;
		switch (sel.matcher) {
			case "=": return (actual) => expected === actual;
			case "~=": return (actual) => actual.split(/[ \t]+/).includes(expected);
			case "^=": return (actual) => actual.startsWith(expected);
			case "$=": return (actual) => actual.endsWith(expected);
			case "*=": return (actual) => actual.includes(expected);
			case "|=": return (actual) => expected === actual || actual.startsWith(expected) && actual[expected.length] === "-";
		}
	}
}
function pseudoClassBranch(name, items) {
	if (name !== "empty" && name !== "only-child" && name !== "first-child" && name !== "last-child" && name !== "any-link") throw new Error(`Unsupported pseudo-class: :${name}`);
	for (const item of items) spliceSimpleSelector(item, (x) => x.type === "pc" && x.name === name);
	return {
		type: "pseudoClass",
		name,
		cont: weave(items)
	};
}
function combinatorBranch(combinator, items) {
	const groups = spliceAndGroup(items, (x) => x.type === "combinator" && x.combinator === combinator, (x) => serialize(x.left));
	const leftItems = [];
	for (const group of Object.values(groups)) {
		const rightCont = weave(group.items);
		const leftAst = group.oneSimpleSelector.left;
		leftItems.push({
			ast: leftAst,
			terminal: {
				type: "popElement",
				cont: rightCont
			}
		});
	}
	return {
		type: "pushElement",
		combinator,
		cont: weave(leftItems)
	};
}
function spliceAndGroup(items, predicate, keyCallback) {
	const groups = {};
	while (items.length) {
		const bestKey = findTopKey(items, predicate, keyCallback);
		const bestKeyPredicate = (sel) => predicate(sel) && keyCallback(sel) === bestKey;
		const hasBestKeyPredicate = (item) => item.ast.list.some(bestKeyPredicate);
		const { matches, rest } = partition(items, hasBestKeyPredicate);
		let oneSimpleSelector = null;
		for (const item of matches) {
			const splicedNode = spliceSimpleSelector(item, bestKeyPredicate);
			if (!oneSimpleSelector) oneSimpleSelector = splicedNode;
		}
		if (oneSimpleSelector == null) throw new Error("No simple selector is found.");
		groups[bestKey] = {
			oneSimpleSelector,
			items: matches
		};
		items = rest;
	}
	return groups;
}
function spliceSimpleSelector(item, predicate) {
	const simpleSelectors = item.ast.list;
	const matches = new Array(simpleSelectors.length);
	let firstIndex = -1;
	for (let i = simpleSelectors.length; i-- > 0;) if (predicate(simpleSelectors[i])) {
		matches[i] = true;
		firstIndex = i;
	}
	if (firstIndex == -1) throw new Error(`Couldn't find the required simple selector.`);
	const result = simpleSelectors[firstIndex];
	item.ast.list = simpleSelectors.filter((_, i) => !matches[i]);
	return result;
}
function findTopKey(items, predicate, keyCallback) {
	const candidates = {};
	for (const item of items) {
		const candidates1 = {};
		for (const node of item.ast.list.filter(predicate)) candidates1[keyCallback(node)] = true;
		for (const key of Object.keys(candidates1)) if (candidates[key]) candidates[key]++;
		else candidates[key] = 1;
	}
	let topKind = "";
	let topCounter = 0;
	for (const entry of Object.entries(candidates)) if (entry[1] > topCounter) {
		topKind = entry[0];
		topCounter = entry[1];
	}
	return topKind;
}
function partition(src, predicate) {
	const matches = [];
	const rest = [];
	for (const x of src) if (predicate(x)) matches.push(x);
	else rest.push(x);
	return {
		matches,
		rest
	};
}
var Picker = class {
	f;
	constructor(f) {
		this.f = f;
	}
	pickAll(el) {
		return this.f(el);
	}
	pick1(el, preferFirst = false) {
		const results = this.f(el);
		const len = results.length;
		if (len === 0) return null;
		if (len === 1) return results[0].value;
		const comparator = preferFirst ? comparatorPreferFirst : comparatorPreferLast;
		let result = results[0];
		for (let i = 1; i < len; i++) {
			const next = results[i];
			if (comparator(result, next)) result = next;
		}
		return result.value;
	}
};
function comparatorPreferFirst(acc, next) {
	const diff = compareSpecificity(next.specificity, acc.specificity);
	return diff > 0 || diff === 0 && next.index < acc.index;
}
function comparatorPreferLast(acc, next) {
	const diff = compareSpecificity(next.specificity, acc.specificity);
	return diff > 0 || diff === 0 && next.index > acc.index;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/@selderee/plugin-htmlparser2/lib/hp2-builder.mjs
function hp2Builder(nodes) {
	return new Picker(handleArray(nodes));
}
function handleArray(nodes) {
	const matchers = nodes.map(handleNode);
	return (el, ...tail) => matchers.flatMap((m) => m(el, ...tail));
}
function handleNode(node) {
	switch (node.type) {
		case "terminal": {
			const result = [node.valueContainer];
			return () => result;
		}
		case "tagName": return handleTagName(node);
		case "attrValue": return handleAttrValueName(node);
		case "attrPresence": return handleAttrPresenceName(node);
		case "pseudoClass": return handlePseudoClassNode(node);
		case "pushElement": return handlePushElementNode(node);
		case "popElement": return handlePopElementNode(node);
	}
}
function handleTagName(node) {
	const variants = {};
	for (const variant of node.variants) variants[variant.value] = handleArray(variant.cont);
	return (el, ...tail) => {
		const continuation = variants[el.name];
		return continuation ? continuation(el, ...tail) : [];
	};
}
function handleAttrPresenceName(node) {
	const attrName = node.name;
	const continuation = handleArray(node.cont);
	return (el, ...tail) => Object.prototype.hasOwnProperty.call(el.attribs, attrName) ? continuation(el, ...tail) : [];
}
function handleAttrValueName(node) {
	const callbacks = [];
	for (const matcher of node.matchers) {
		const predicate = matcher.predicate;
		const continuation = handleArray(matcher.cont);
		callbacks.push((attr, el, ...tail) => predicate(attr) ? continuation(el, ...tail) : []);
	}
	const attrName = node.name;
	return (el, ...tail) => {
		const attr = el.attribs[attrName];
		return attr || attr === "" ? callbacks.flatMap((cb) => cb(attr, el, ...tail)) : [];
	};
}
function handlePseudoClassNode(node) {
	const continuation = handleArray(node.cont);
	const predicate = pseudoClassPredicates[node.name];
	if (!predicate) throw new Error(`Unsupported pseudo-class: :${node.name}`);
	return (el, ...tail) => predicate(el) ? continuation(el, ...tail) : [];
}
var pseudoClassPredicates = {
	"empty": isEmptyElement,
	"only-child": isOnlyChildElement,
	"first-child": isFirstChildElement,
	"last-child": isLastChildElement,
	"any-link": isAnyLinkElement
};
function isEmptyElement(el) {
	for (const child of el.children) {
		if (isTag(child)) return false;
		if (child.type === ElementType.Text || child.type === ElementType.CDATA) return false;
	}
	return true;
}
function isOnlyChildElement(el) {
	return getPrecedingElement(el) === null && getFollowingElement(el) === null;
}
function isFirstChildElement(el) {
	return getPrecedingElement(el) === null;
}
function isLastChildElement(el) {
	return getFollowingElement(el) === null;
}
function isAnyLinkElement(el) {
	return (el.name === "a" || el.name === "area") && Object.prototype.hasOwnProperty.call(el.attribs, "href");
}
function handlePushElementNode(node) {
	const continuation = handleArray(node.cont);
	const leftElementGetter = node.combinator === "+" ? getPrecedingElement : getParentElement;
	return (el, ...tail) => {
		const next = leftElementGetter(el);
		if (next === null) return [];
		return continuation(next, el, ...tail);
	};
}
var getPrecedingElement = (el) => {
	const prev = el.prev;
	if (prev === null) return null;
	return isTag(prev) ? prev : getPrecedingElement(prev);
};
var getFollowingElement = (el) => {
	const next = el.next;
	if (next === null) return null;
	return isTag(next) ? next : getFollowingElement(next);
};
var getParentElement = (el) => {
	const parent = el.parent;
	return parent && isTag(parent) ? parent : null;
};
function handlePopElementNode(node) {
	const continuation = handleArray(node.cont);
	return (_el, next, ...tail) => continuation(next, ...tail);
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/htmlparser2/node_modules/entities/dist/esm/decode-codepoint.js
var _a;
var decodeMap = /* @__PURE__ */ new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]);
/**
* Polyfill for `String.fromCodePoint`. It is used to create a string from a Unicode code point.
*/
var fromCodePoint = (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : ((codePoint) => {
	let output = "";
	if (codePoint > 65535) {
		codePoint -= 65536;
		output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
		codePoint = 56320 | codePoint & 1023;
	}
	output += String.fromCharCode(codePoint);
	return output;
});
/**
* Replace the given code point with a replacement character if it is a
* surrogate or is outside the valid range. Otherwise return the code
* point unchanged.
*/
function replaceCodePoint(codePoint) {
	var _a;
	if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
	return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/htmlparser2/node_modules/entities/dist/esm/internal/decode-shared.js
function decodeBase64(input) {
	const binary = typeof atob === "function" ? atob(input) : typeof Buffer.from === "function" ? Buffer.from(input, "base64").toString("binary") : new Buffer(input, "base64").toString("binary");
	const evenLength = binary.length & -2;
	const out = new Uint16Array(evenLength / 2);
	for (let index = 0, outIndex = 0; index < evenLength; index += 2) {
		const lo = binary.charCodeAt(index);
		const hi = binary.charCodeAt(index + 1);
		out[outIndex++] = lo | hi << 8;
	}
	return out;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/htmlparser2/node_modules/entities/dist/esm/generated/decode-data-html.js
var htmlDecodeTree = /* #__PURE__ */ decodeBase64("QR08ALkAAgH6AYsDNQR2BO0EPgXZBQEGLAbdBxMISQrvCmQLfQurDKQNLw4fD4YPpA+6D/IPAAAAAAAAAAAAAAAAKhBMEY8TmxUWF2EYLBkxGuAa3RsJHDscWR8YIC8jSCSIJcMl6ie3Ku8rEC0CLjoupS7kLgAIRU1hYmNmZ2xtbm9wcnN0dVQAWgBeAGUAaQBzAHcAfgCBAIQAhwCSAJoAoACsALMAbABpAGcAO4DGAMZAUAA7gCYAJkBjAHUAdABlADuAwQDBQHIiZXZlAAJhAAFpeW0AcgByAGMAO4DCAMJAEGRyAADgNdgE3XIAYQB2AGUAO4DAAMBA8CFoYZFj4SFjcgBhZAAAoFMqAAFncIsAjgBvAG4ABGFmAADgNdg43fAlbHlGdW5jdGlvbgCgYSBpAG4AZwA7gMUAxUAAAWNzpACoAHIAAOA12Jzc6SFnbgCgVCJpAGwAZABlADuAwwDDQG0AbAA7gMQAxEAABGFjZWZvcnN1xQDYANoA7QDxAPYA+QD8AAABY3LJAM8AayNzbGFzaAAAoBYidgHTANUAAKDnKmUAZAAAoAYjeQARZIABY3J0AOAA5QDrAGEidXNlAACgNSLuI291bGxpcwCgLCFhAJJjcgAA4DXYBd1wAGYAAOA12Dnd5SF2ZdhiYwDyAOoAbSJwZXEAAKBOIgAHSE9hY2RlZmhpbG9yc3UXARoBHwE6AVIBVQFiAWQBZgGCAakB6QHtAfIBYwB5ACdkUABZADuAqQCpQIABY3B5ACUBKAE1AfUhdGUGYWmg0iJ0KGFsRGlmZmVyZW50aWFsRAAAoEUhbCJleXMAAKAtIQACYWVpb0EBRAFKAU0B8iFvbgxhZABpAGwAO4DHAMdAcgBjAAhhbiJpbnQAAKAwIm8AdAAKYQABZG5ZAV0BaSJsbGEAuGB0I2VyRG90ALdg8gA5AWkAp2NyImNsZQAAAkRNUFRwAXQBeQF9AW8AdAAAoJkiaSJudXMAAKCWIuwhdXMAoJUiaSJtZXMAAKCXIm8AAAFjc4cBlAFrKndpc2VDb250b3VySW50ZWdyYWwAAKAyImUjQ3VybHkAAAFEUZwBpAFvJXVibGVRdW90ZQAAoB0gdSJvdGUAAKAZIAACbG5wdbABtgHNAdgBbwBuAGWgNyIAoHQqgAFnaXQAvAHBAcUB8iJ1ZW50AKBhIm4AdAAAoC8i7yV1ckludGVncmFsAKAuIgABZnLRAdMBAKACIe8iZHVjdACgECJuLnRlckNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbAAAoDMi7yFzcwCgLypjAHIAAOA12J7ccABDoNMiYQBwAACgTSKABURKU1phY2VmaW9zAAsCEgIVAhgCGwIsAjQCOQI9AnMCfwNvoEUh9CJyYWhkAKARKWMAeQACZGMAeQAFZGMAeQAPZIABZ3JzACECJQIoAuchZXIAoCEgcgAAoKEhaAB2AACg5CoAAWF5MAIzAvIhb24OYRRkbAB0oAciYQCUY3IAAOA12AfdAAFhZkECawIAAWNtRQJnAvIjaXRpY2FsAAJBREdUUAJUAl8CYwJjInV0ZQC0YG8AdAFZAloC2WJiJGxlQWN1dGUA3WJyImF2ZQBgYGkibGRlANxi7yFuZACgxCJmJWVyZW50aWFsRAAAoEYhcAR9AgAAAAAAAIECjgIAABoDZgAA4DXYO91EoagAhQKJAm8AdAAAoNwgcSJ1YWwAAKBQIuIhbGUAA0NETFJVVpkCqAK1Au8C/wIRA28AbgB0AG8AdQByAEkAbgB0AGUAZwByAGEA7ADEAW8AdAKvAgAAAACwAqhgbiNBcnJvdwAAoNMhAAFlb7kC0AJmAHQAgAFBUlQAwQLGAs0CciJyb3cAAKDQIekkZ2h0QXJyb3cAoNQhZQDlACsCbgBnAAABTFLWAugC5SFmdAABQVLcAuECciJyb3cAAKD4J+kkZ2h0QXJyb3cAoPon6SRnaHRBcnJvdwCg+SdpImdodAAAAUFU9gL7AnIicm93AACg0iFlAGUAAKCoInAAQQIGAwAAAAALA3Iicm93AACg0SFvJHduQXJyb3cAAKDVIWUlcnRpY2FsQmFyAACgJSJuAAADQUJMUlRhJAM2AzoDWgNxA3oDciJyb3cAAKGTIUJVLAMwA2EAcgAAoBMpcCNBcnJvdwAAoPUhciJldmUAEWPlIWZ00gJDAwAASwMAAFIDaSVnaHRWZWN0b3IAAKBQKWUkZVZlY3RvcgAAoF4p5SJjdG9yQqC9IWEAcgAAoFYpaSJnaHQA1AFiAwAAaQNlJGVWZWN0b3IAAKBfKeUiY3RvckKgwSFhAHIAAKBXKWUAZQBBoKQiciJyb3cAAKCnIXIAcgBvAPcAtAIAAWN0gwOHA3IA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YwAAoN8i4SFycnCgtiEAoD0pgKIqImJjZG9zACsVMBU6FT4VQRVyImNhcAAAoEgqAAFhdTQVNxVwAACgRipwAACgSipvAHQAAKCNInIAAKBFKgDgKiIA/gACYWxydksVURVuFXMVcgByAG2gtyEAoDwpeQCAAWV2dwBYFWUVaRVxAHACXxUAAAAAYxVyAGUA4wAXFXUA4wAZFWUAZQAAoM4iZSJkZ2UAAKDPImUAbgA7gKQApEBlI2Fycm93AAABbHJ7FX8V5SFmdACgtiFpImdodAAAoLchZQDkAG0VAAFjaYsVkRVvAG4AaQBuAPQAkwFuAHQAAKAxImwiY3R5AACgLSOACUFIYWJjZGVmaGlqbG9yc3R1d3oAuBW7Fb8V1RXgFegV+RUKFhUWHxZUFlcWZRbFFtsW7xb7FgUXChdyAPIAtAJhAHIAAKBlKQACZ2xyc8YVyhXOFdAV5yFlcgCgICDlIXRoAKA4IfIA9QxoAHagECAAoKMiawHZFd4VYSJyb3cAAKAPKWEA4wBfAgABYXnkFecV8iFvbg9hNGQAoUYhYW/tFfQVAAFnciEC8RVyAACgyiF0InNlcQAAoHcqgAFnbG0A/xUCFgUWO4CwALBAdABhALRjcCJ0eXYAAKCxKQABaXIOFhIW8yFodACgfykA4DXYId1hAHIAAAFschsWHRYAoMMhAKDCIYACYWVnc3YAKBauAjYWOhY+Fm0AAKHEIm9zLhY0Fm4AZABzoMQi9SFpdACgZiZhIm1tYQDdY2kAbgAAoPIiAKH3AGlvQxZRFmQAZQAAgfcAO29KFksW90BuI3RpbWVzAACgxyJuAPgAUBZjAHkAUmRjAG8CXhYAAAAAYhZyAG4AAKAeI28AcAAAoA0jgAJscHR1dwBuFnEWdRaSFp4W7CFhciRgZgAA4DXYVd0AotkCZW1wc30WhBaJFo0WcQBkoFAibwB0AACgUSJpIm51cwAAoDgi7CF1cwCgFCLxInVhcmUAoKEiYgBsAGUAYgBhAHIAdwBlAGQAZwDlANcAbgCAAWFkaAClFqoWtBZyAHIAbwD3APUMbwB3AG4AYQByAHIAbwB3APMA8xVhI3Jwb29uAAABbHK8FsAWZQBmAPQAHBZpAGcAaAD0AB4WYgHJFs8WawBhAHIAbwD3AJILbwLUFgAAAADYFnIAbgAAoB8jbwBwAACgDCOAAWNvdADhFukW7BYAAXJ55RboFgDgNdi53FVkbAAAoPYp8iFvaxFhAAFkcvMW9xZvAHQAAKDxImkA5qC/JVsSAAFhaP8WAhdyAPIANQNhAPIA1wvhIm5nbGUAoKYpAAFjaQ4XEBd5AF9k5yJyYXJyAKD/JwAJRGFjZGVmZ2xtbm9wcXJzdHV4MRc4F0YXWxcyBF4XaRd5F40XrBe0F78X2RcVGCEYLRg1GEAYAAFEbzUXgRZvAPQA+BUAAWNzPBdCF3UAdABlADuA6QDpQPQhZXIAoG4qAAJhaW95TRdQF1YXWhfyIW9uG2FyAGOgViI7gOoA6kDsIW9uAKBVIk1kbwB0ABdhAAFEcmIXZhdvAHQAAKBSIgDgNdgi3XKhmipuF3QXYQB2AGUAO4DoAOhAZKCWKm8AdAAAoJgqgKGZKmlscwCAF4UXhxfuInRlcnMAoOcjAKATIWSglSpvAHQAAKCXKoABYXBzAJMXlheiF2MAcgATYXQAeQBzogUinxcAAAAAoRdlAHQAAKAFInAAMaADIDMBqRerFwCgBCAAoAUgAAFnc7AXsRdLYXAAAKACIAABZ3C4F7sXbwBuABlhZgAA4DXYVt2AAWFscwDFF8sXzxdyAHOg1SJsAACg4yl1AHMAAKBxKmkAAKG1A2x21RfYF28AbgC1Y/VjAAJjc3V24BfoF/0XEBgAAWlv5BdWF3IAYwAAoFYiaQLuFwAAAADwF+0ADQThIW50AAFnbPUX+Rd0AHIAAKCWKuUhc3MAoJUqgAFhZWkAAxgGGAoYbABzAD1gcwB0AACgXyJ2AESgYSJEAACgeCrwImFyc2wAoOUpAAFEYRkYHRhvAHQAAKBTInIAcgAAoHEpgAFjZGkAJxgqGO0XcgAAoC8hbwD0AIwCAAFhaDEYMhi3YzuA8ADwQAABbXI5GD0YbAA7gOsA60BvAACgrCCAAWNpcABGGEgYSxhsACFgcwD0ACwEAAFlb08YVxhjAHQAYQB0AGkAbwDuABoEbgBlAG4AdABpAGEAbADlADME4Ql1GAAAgRgAAIMYiBgAAAAAoRilGAAAqhgAALsYvhjRGAAA1xgnGWwAbABpAG4AZwBkAG8AdABzAGUA8QBlF3kARGRtImFsZQAAoEAmgAFpbHIAjRiRGJ0Y7CFpZwCgA/tpApcYAAAAAJoYZwAAoAD7aQBnAACgBPsA4DXYI93sIWlnAKAB++whaWcA4GYAagCAAWFsdACvGLIYthh0AACgbSZpAGcAAKAC+24AcwAAoLElbwBmAJJh8AHCGAAAxhhmAADgNdhX3QABYWvJGMwYbADsAGsEdqDUIgCg2SphI3J0aW50AACgDSoAAWFv2hgiGQABY3PeGB8ZsQPnGP0YBRkSGRUZAAAdGbID7xjyGPQY9xj5GAAA+xg7gL0AvUAAoFMhO4C8ALxAAKBVIQCgWSEAoFshswEBGQAAAxkAoFQhAKBWIbQCCxkOGQAAAAAQGTuAvgC+QACgVyEAoFwhNQAAoFghtgEZGQAAGxkAoFohAKBdITgAAKBeIWwAAKBEIHcAbgAAoCIjYwByAADgNdi73IAIRWFiY2RlZmdpamxub3JzdHYARhlKGVoZXhlmGWkZkhmWGZkZnRmgGa0ZxhnLGc8Z4BkjGmygZyIAoIwqgAFjbXAAUBlTGVgZ9SF0ZfVhbQBhAOSgswM6FgCghipyImV2ZQAfYQABaXliGWUZcgBjAB1hM2RvAHQAIWGAoWUibHFzAMYEcBl6GfGhZSLOBAAAdhlsAGEAbgD0AN8EgKF+KmNkbACBGYQZjBljAACgqSpvAHQAb6CAKmyggioAoIQqZeDbIgD+cwAAoJQqcgAA4DXYJN3noGsirATtIWVsAKA3IWMAeQBTZIChdyJFYWoApxmpGasZAKCSKgCgpSoAoKQqAAJFYWVztBm2Gb0ZwhkAoGkicABwoIoq8iFveACgiipxoIgq8aCIKrUZaQBtAACg5yJwAGYAAOA12FjdYQB2AOUAYwIAAWNp0xnWGXIAAKAKIW0AAKFzImVs3BneGQCgjioAoJAqAIM+ADtjZGxxco0E6xn0GfgZ/BkBGgABY2nvGfEZAKCnKnIAAKB6Km8AdAAAoNci0CFhcgCglSl1ImVzdAAAoHwqgAJhZGVscwAKGvQZFhrVBCAa8AEPGgAAFBpwAHIAbwD4AFkZcgAAoHgpcQAAAWxxxAQbGmwAZQBzAPMASRlpAO0A5AQAAWVuJxouGnIjdG5lcXEAAOBpIgD+xQAsGgAFQWFiY2Vma29zeUAaQxpmGmoabRqDGocalhrCGtMacgDyAMwCAAJpbG1yShpOGlAaVBpyAHMA8ABxD2YAvWBpAGwA9AASBQABZHJYGlsaYwB5AEpkAKGUIWN3YBpkGmkAcgAAoEgpAKCtIWEAcgAAoA8h6SFyYyVhgAFhbHIAcxp7Gn8a8iF0c3WgZSZpAHQAAKBlJuwhaXAAoCYg4yFvbgCguSJyAADgNdgl3XMAAAFld4wakRphInJvdwAAoCUpYSJyb3cAAKAmKYACYW1vcHIAnxqjGqcauhq+GnIAcgAAoP8h9CFodACgOyJrAAABbHKsGrMaZSRmdGFycm93AACgqSHpJGdodGFycm93AKCqIWYAAOA12Fnd4iFhcgCgFSCAAWNsdADIGswa0BpyAADgNdi93GEAcwDoAGka8iFvaydhAAFicNca2xr1IWxsAKBDIOghZW4AoBAg4Qr2GgAA/RoAAAgbExsaGwAAIRs7GwAAAAA+G2IbmRuVG6sbAACyG80b0htjAHUAdABlADuA7QDtQAChYyBpeQEbBhtyAGMAO4DuAO5AOGQAAWN4CxsNG3kANWRjAGwAO4ChAKFAAAFmcssCFhsA4DXYJt1yAGEAdgBlADuA7ADsQIChSCFpbm8AJxsyGzYbAAFpbisbLxtuAHQAAKAMKnQAAKAtIuYhaW4AoNwpdABhAACgKSHsIWlnM2GAAWFvcABDG1sbXhuAAWNndABJG0sbWRtyACthgAFlbHAAcQVRG1UbaQBuAOUAyAVhAHIA9AByBWgAMWFmAACgtyJlAGQAtWEAoggiY2ZvdGkbbRt1G3kb4SFyZQCgBSFpAG4AdKAeImkAZQAAoN0pZABvAPQAWxsAoisiY2VscIEbhRuPG5QbYQBsAACguiIAAWdyiRuNG2UAcgDzACMQ4wCCG2EicmhrAACgFyryIW9kAKA8KgACY2dwdJ8boRukG6gbeQBRZG8AbgAvYWYAAOA12FrdYQC5Y3UAZQBzAHQAO4C/AL9AAAFjabUbuRtyAADgNdi+3G4AAKIIIkVkc3bCG8QbyBvQAwCg+SJvAHQAAKD1Inag9CIAoPMiaaBiIOwhZGUpYesB1hsAANkbYwB5AFZkbAA7gO8A70AAA2NmbW9zdeYb7hvyG/Ub+hsFHAABaXnqG+0bcgBjADVhOWRyAADgNdgn3eEhdGg3YnAAZgAA4DXYW93jAf8bAAADHHIAAOA12L/c8iFjeVhk6yFjeVRkAARhY2ZnaGpvcxUcGhwiHCYcKhwtHDAcNRzwIXBhdqC6A/BjAAFleR4cIRzkIWls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ZmdobG1vcHJzdHV3CiwNLBEsHSwnLDEsQCxLLFIsYix6LIQsjyzLLOgs7Sz/LAotcgDyAAkDYQByAACgYykAAWNyFSwbLHUAdABlADuA+gD6QPIACQ1yAOMBIywAACUseQBeZHYAZQBtYQABaXkrLDAscgBjADuA+wD7QENkgAFhYmgANyw6LD0scgDyANEO7CFhY3FhYQDyAOAOAAFpckQsSCzzIWh0AKB+KQDgNdgy3XIAYQB2AGUAO4D5APlAYQFWLF8scgAAAWxyWixcLACgvyEAoL4hbABrAACggCUAAWN0Zix2LG8CbCwAAAAAcyxyAG4AZaAcI3IAAKAcI28AcAAAoA8jcgBpAACg+CUAAWFsfiyBLGMAcgBrYTuAqACoQAABZ3CILIssbwBuAHNhZgAA4DXYZt0AA2FkaGxzdZksniynLLgsuyzFLHIAcgBvAPcACQ1vAHcAbgBhAHIAcgBvAPcA2A5hI3Jwb29uAAABbHKvLLMsZQBmAPQAWyxpAGcAaAD0AF0sdQDzAKYOaQAAocUDaGzBLMIs0mNvAG4AxWPwI2Fycm93cwCgyCGAAWNpdADRLOEs5CxvAtcsAAAAAN4scgBuAGWgHSNyAACgHSNvAHAAAKAOI24AZwBvYXIAaQAAoPklYwByAADgNdjK3IABZGlyAPMs9yz6LG8AdAAAoPAi7CFkZWlhaQBmoLUlAKC0JQABYW0DLQYtcgDyAMosbAA7gPwA/EDhIm5nbGUAoKcpgAdBQkRhY2RlZmxub3Byc3oAJy0qLTAtNC2bLZ0toS2/LcMtxy3TLdgt3C3gLfwtcgDyABADYQByAHag6CoAoOkqYQBzAOgA/gIAAW5yOC08LechcnQAoJwpgANla25wcnN0AJkpSC1NLVQtXi1iLYItYQBwAHAA4QAaHG8AdABoAGkAbgDnAKEXgAFoaXIAoSmzJFotbwBwAPQAdCVooJUh7wD4JgABaXVmLWotZwBtAOEAuygAAWJwbi14LXMjZXRuZXEAceCKIgD+AODLKgD+cyNldG5lcQBx4IsiAP4A4MwqAP4AAWhyhi2KLWUAdADhABIraSNhbmdsZQAAAWxyki2WLeUhZnQAoLIiaSJnaHQAAKCzInkAMmThIXNoAKCiIoABZWxyAKcttC24LWKiKCKuLQAAAACyLWEAcgAAoLsicQAAoFoi7CFpcACg7iIAAWJ0vC1eD2EA8gBfD3IAAOA12DPddAByAOkAlS1zAHUAAAFicM0t0C0A4IIi0iAA4IMi0iBwAGYAAOA12GfdcgBvAPAAWQt0AHIA6QCaLQABY3XkLegtcgAA4DXYy9wAAWJw7C30LW4AAAFFZXUt8S0A4IoiAP5uAAABRWV/LfktAOCLIgD+6SJnemFnAKCaKYADY2Vmb3BycwANLhAuJS4pLiMuLi40LukhcmN1YQABZGkULiEuAAFiZxguHC5hAHIAAKBfKmUAcaAnIgCgWSLlIXJwAKAYIXIAAOA12DTdcABmAADgNdho3WWgQCJhAHQA6ABqD2MAcgAA4DXYzNzjCuQRUC4AAFQuAABYLmIuAAAAAGMubS5wLnQuAAAAAIguki4AAJouJxIqEnQAcgDpAB0ScgAA4DXYNd0AAUFhWy5eLnIA8gDnAnIA8gCTB75jAAFBYWYuaS5yAPIA4AJyAPIAjAdhAPAAeh5pAHMAAKD7IoABZHB0APgReS6DLgABZmx9LoAuAOA12GnddQDzAP8RaQBtAOUABBIAAUFhiy6OLnIA8gDuAnIA8gCaBwABY3GVLgoScgAA4DXYzdwAAXB0nS6hLmwAdQDzACUScgDpACASAARhY2VmaW9zdbEuvC7ELsguzC7PLtQu2S5jAAABdXm2LrsudABlADuA/QD9QE9kAAFpecAuwy5yAGMAd2FLZG4AO4ClAKVAcgAA4DXYNt1jAHkAV2RwAGYAAOA12GrdYwByAADgNdjO3AABY23dLt8ueQBOZGwAO4D/AP9AAAVhY2RlZmhpb3N38y73Lv8uAi8MLxAvEy8YLx0vIi9jInV0ZQB6YQABYXn7Lv4u8iFvbn5hN2RvAHQAfGEAAWV0Bi8KL3QAcgDmAB8QYQC2Y3IAAOA12DfdYwB5ADZk5yJyYXJyAKDdIXAAZgAA4DXYa91jAHIAAOA12M/cAAFqbiYvKC8AoA0gagAAoAwg");
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/htmlparser2/node_modules/entities/dist/esm/generated/decode-data-xml.js
var xmlDecodeTree = /* #__PURE__ */ decodeBase64("AAJhZ2xxBwARABMAFQBtAg0AAAAAAA8AcAAmYG8AcwAnYHQAPmB0ADxg9SFvdCJg");
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/htmlparser2/node_modules/entities/dist/esm/internal/bin-trie-flags.js
/**
* Bit flags & masks for the binary trie encoding used for entity decoding.
*
* Bit layout (16 bits total):
* 15..14 VALUE_LENGTH   (+1 encoding; 0 => no value)
* 13     FLAG13.        If valueLength>0: semicolon required flag (implicit ';').
*                       If valueLength==0: compact run flag.
* 12..7  BRANCH_LENGTH  Branch length (0 => single branch in 6..0 if jumpOffset==char) OR run length (when compact run)
* 6..0   JUMP_TABLE     Jump offset (jump table) OR single-branch char code OR first run char
*/
var BinTrieFlags;
(function(BinTrieFlags) {
	BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
	BinTrieFlags[BinTrieFlags["FLAG13"] = 8192] = "FLAG13";
	BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 8064] = "BRANCH_LENGTH";
	BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/htmlparser2/node_modules/entities/dist/esm/decode.js
var CharCodes$1;
(function(CharCodes) {
	CharCodes[CharCodes["NUM"] = 35] = "NUM";
	CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
	CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
	CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
	CharCodes[CharCodes["NINE"] = 57] = "NINE";
	CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
	CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
	CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
	CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
	CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
	CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
	CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes$1 || (CharCodes$1 = {}));
/** Bit that needs to be set to convert an upper case ASCII character to lower case */
var TO_LOWER_BIT = 32;
function isNumber(code) {
	return code >= CharCodes$1.ZERO && code <= CharCodes$1.NINE;
}
function isHexadecimalCharacter(code) {
	return code >= CharCodes$1.UPPER_A && code <= CharCodes$1.UPPER_F || code >= CharCodes$1.LOWER_A && code <= CharCodes$1.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
	return code >= CharCodes$1.UPPER_A && code <= CharCodes$1.UPPER_Z || code >= CharCodes$1.LOWER_A && code <= CharCodes$1.LOWER_Z || isNumber(code);
}
/**
* Checks if the given character is a valid end character for an entity in an attribute.
*
* Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
* See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
*/
function isEntityInAttributeInvalidEnd(code) {
	return code === CharCodes$1.EQUALS || isAsciiAlphaNumeric(code);
}
var EntityDecoderState;
(function(EntityDecoderState) {
	EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
	EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
	EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
	EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
	EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode) {
	/** Entities in text nodes that can end with any character. */
	DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
	/** Only allow entities terminated with a semicolon. */
	DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
	/** Entities in attributes have limitations on ending characters. */
	DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
/**
* Token decoder with support of writing partial entities.
*/
var EntityDecoder = class {
	constructor(decodeTree, emitCodePoint, errors) {
		this.decodeTree = decodeTree;
		this.emitCodePoint = emitCodePoint;
		this.errors = errors;
		/** The current state of the decoder. */
		this.state = EntityDecoderState.EntityStart;
		/** Characters that were consumed while parsing an entity. */
		this.consumed = 1;
		/**
		* The result of the entity.
		*
		* Either the result index of a numeric entity, or the codepoint of a
		* numeric entity.
		*/
		this.result = 0;
		/** The current index in the decode tree. */
		this.treeIndex = 0;
		/** The number of characters that were consumed in excess. */
		this.excess = 1;
		/** The mode in which the decoder is operating. */
		this.decodeMode = DecodingMode.Strict;
		/** The number of characters that have been consumed in the current run. */
		this.runConsumed = 0;
	}
	/** Resets the instance to make it reusable. */
	startEntity(decodeMode) {
		this.decodeMode = decodeMode;
		this.state = EntityDecoderState.EntityStart;
		this.result = 0;
		this.treeIndex = 0;
		this.excess = 1;
		this.consumed = 1;
		this.runConsumed = 0;
	}
	/**
	* Write an entity to the decoder. This can be called multiple times with partial entities.
	* If the entity is incomplete, the decoder will return -1.
	*
	* Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
	* entity is incomplete, and resume when the next string is written.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	write(input, offset) {
		switch (this.state) {
			case EntityDecoderState.EntityStart:
				if (input.charCodeAt(offset) === CharCodes$1.NUM) {
					this.state = EntityDecoderState.NumericStart;
					this.consumed += 1;
					return this.stateNumericStart(input, offset + 1);
				}
				this.state = EntityDecoderState.NamedEntity;
				return this.stateNamedEntity(input, offset);
			case EntityDecoderState.NumericStart: return this.stateNumericStart(input, offset);
			case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(input, offset);
			case EntityDecoderState.NumericHex: return this.stateNumericHex(input, offset);
			case EntityDecoderState.NamedEntity: return this.stateNamedEntity(input, offset);
		}
	}
	/**
	* Switches between the numeric decimal and hexadecimal states.
	*
	* Equivalent to the `Numeric character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericStart(input, offset) {
		if (offset >= input.length) return -1;
		if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes$1.LOWER_X) {
			this.state = EntityDecoderState.NumericHex;
			this.consumed += 1;
			return this.stateNumericHex(input, offset + 1);
		}
		this.state = EntityDecoderState.NumericDecimal;
		return this.stateNumericDecimal(input, offset);
	}
	/**
	* Parses a hexadecimal numeric entity.
	*
	* Equivalent to the `Hexademical character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericHex(input, offset) {
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char) || isHexadecimalCharacter(char)) {
				const digit = char <= CharCodes$1.NINE ? char - CharCodes$1.ZERO : (char | TO_LOWER_BIT) - CharCodes$1.LOWER_A + 10;
				this.result = this.result * 16 + digit;
				this.consumed++;
				offset++;
			} else return this.emitNumericEntity(char, 3);
		}
		return -1;
	}
	/**
	* Parses a decimal numeric entity.
	*
	* Equivalent to the `Decimal character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericDecimal(input, offset) {
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char)) {
				this.result = this.result * 10 + (char - CharCodes$1.ZERO);
				this.consumed++;
				offset++;
			} else return this.emitNumericEntity(char, 2);
		}
		return -1;
	}
	/**
	* Validate and emit a numeric entity.
	*
	* Implements the logic from the `Hexademical character reference start
	* state` and `Numeric character reference end state` in the HTML spec.
	*
	* @param lastCp The last code point of the entity. Used to see if the
	*               entity was terminated with a semicolon.
	* @param expectedLength The minimum number of characters that should be
	*                       consumed. Used to validate that at least one digit
	*                       was consumed.
	* @returns The number of characters that were consumed.
	*/
	emitNumericEntity(lastCp, expectedLength) {
		var _a;
		if (this.consumed <= expectedLength) {
			(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
			return 0;
		}
		if (lastCp === CharCodes$1.SEMI) this.consumed += 1;
		else if (this.decodeMode === DecodingMode.Strict) return 0;
		this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
		if (this.errors) {
			if (lastCp !== CharCodes$1.SEMI) this.errors.missingSemicolonAfterCharacterReference();
			this.errors.validateNumericCharacterReference(this.result);
		}
		return this.consumed;
	}
	/**
	* Parses a named entity.
	*
	* Equivalent to the `Named character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNamedEntity(input, offset) {
		const { decodeTree } = this;
		let current = decodeTree[this.treeIndex];
		let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
		while (offset < input.length) {
			if (valueLength === 0 && (current & BinTrieFlags.FLAG13) !== 0) {
				const runLength = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
				if (this.runConsumed === 0) {
					const firstChar = current & BinTrieFlags.JUMP_TABLE;
					if (input.charCodeAt(offset) !== firstChar) return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
					offset++;
					this.excess++;
					this.runConsumed++;
				}
				while (this.runConsumed < runLength) {
					if (offset >= input.length) return -1;
					const charIndexInPacked = this.runConsumed - 1;
					const packedWord = decodeTree[this.treeIndex + 1 + (charIndexInPacked >> 1)];
					const expectedChar = charIndexInPacked % 2 === 0 ? packedWord & 255 : packedWord >> 8 & 255;
					if (input.charCodeAt(offset) !== expectedChar) {
						this.runConsumed = 0;
						return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
					}
					offset++;
					this.excess++;
					this.runConsumed++;
				}
				this.runConsumed = 0;
				this.treeIndex += 1 + (runLength >> 1);
				current = decodeTree[this.treeIndex];
				valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			}
			if (offset >= input.length) break;
			const char = input.charCodeAt(offset);
			if (char === CharCodes$1.SEMI && valueLength !== 0 && (current & BinTrieFlags.FLAG13) !== 0) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
			this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
			if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
			current = decodeTree[this.treeIndex];
			valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			if (valueLength !== 0) {
				if (char === CharCodes$1.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
				if (this.decodeMode !== DecodingMode.Strict && (current & BinTrieFlags.FLAG13) === 0) {
					this.result = this.treeIndex;
					this.consumed += this.excess;
					this.excess = 0;
				}
			}
			offset++;
			this.excess++;
		}
		return -1;
	}
	/**
	* Emit a named entity that was not terminated with a semicolon.
	*
	* @returns The number of characters consumed.
	*/
	emitNotTerminatedNamedEntity() {
		var _a;
		const { result, decodeTree } = this;
		const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
		this.emitNamedEntityData(result, valueLength, this.consumed);
		(_a = this.errors) === null || _a === void 0 || _a.missingSemicolonAfterCharacterReference();
		return this.consumed;
	}
	/**
	* Emit a named entity.
	*
	* @param result The index of the entity in the decode tree.
	* @param valueLength The number of bytes in the entity.
	* @param consumed The number of characters consumed.
	*
	* @returns The number of characters consumed.
	*/
	emitNamedEntityData(result, valueLength, consumed) {
		const { decodeTree } = this;
		this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~(BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13) : decodeTree[result + 1], consumed);
		if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
		return consumed;
	}
	/**
	* Signal to the parser that the end of the input was reached.
	*
	* Remaining data will be emitted and relevant errors will be produced.
	*
	* @returns The number of characters consumed.
	*/
	end() {
		var _a;
		switch (this.state) {
			case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
			case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
			case EntityDecoderState.NumericStart:
				(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
				return 0;
			case EntityDecoderState.EntityStart: return 0;
		}
	}
};
/**
* Determines the branch of the current node that is taken given the current
* character. This function is used to traverse the trie.
*
* @param decodeTree The trie.
* @param current The current node.
* @param nodeIdx The index right after the current node and its value.
* @param char The current character.
* @returns The index of the next node, or -1 if no branch is taken.
*/
function determineBranch(decodeTree, current, nodeIndex, char) {
	const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
	const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
	if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
	if (jumpOffset) {
		const value = char - jumpOffset;
		return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
	}
	const packedKeySlots = branchCount + 1 >> 1;
	let lo = 0;
	let hi = branchCount - 1;
	while (lo <= hi) {
		const mid = lo + hi >>> 1;
		const midKey = decodeTree[nodeIndex + (mid >> 1)] >> (mid & 1) * 8 & 255;
		if (midKey < char) lo = mid + 1;
		else if (midKey > char) hi = mid - 1;
		else return decodeTree[nodeIndex + packedKeySlots + mid];
	}
	return -1;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/htmlparser2/dist/esm/Tokenizer.js
var CharCodes;
(function(CharCodes) {
	CharCodes[CharCodes["Tab"] = 9] = "Tab";
	CharCodes[CharCodes["NewLine"] = 10] = "NewLine";
	CharCodes[CharCodes["FormFeed"] = 12] = "FormFeed";
	CharCodes[CharCodes["CarriageReturn"] = 13] = "CarriageReturn";
	CharCodes[CharCodes["Space"] = 32] = "Space";
	CharCodes[CharCodes["ExclamationMark"] = 33] = "ExclamationMark";
	CharCodes[CharCodes["Number"] = 35] = "Number";
	CharCodes[CharCodes["Amp"] = 38] = "Amp";
	CharCodes[CharCodes["SingleQuote"] = 39] = "SingleQuote";
	CharCodes[CharCodes["DoubleQuote"] = 34] = "DoubleQuote";
	CharCodes[CharCodes["Dash"] = 45] = "Dash";
	CharCodes[CharCodes["Slash"] = 47] = "Slash";
	CharCodes[CharCodes["Zero"] = 48] = "Zero";
	CharCodes[CharCodes["Nine"] = 57] = "Nine";
	CharCodes[CharCodes["Semi"] = 59] = "Semi";
	CharCodes[CharCodes["Lt"] = 60] = "Lt";
	CharCodes[CharCodes["Eq"] = 61] = "Eq";
	CharCodes[CharCodes["Gt"] = 62] = "Gt";
	CharCodes[CharCodes["Questionmark"] = 63] = "Questionmark";
	CharCodes[CharCodes["UpperA"] = 65] = "UpperA";
	CharCodes[CharCodes["LowerA"] = 97] = "LowerA";
	CharCodes[CharCodes["UpperF"] = 70] = "UpperF";
	CharCodes[CharCodes["LowerF"] = 102] = "LowerF";
	CharCodes[CharCodes["UpperZ"] = 90] = "UpperZ";
	CharCodes[CharCodes["LowerZ"] = 122] = "LowerZ";
	CharCodes[CharCodes["LowerX"] = 120] = "LowerX";
	CharCodes[CharCodes["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes || (CharCodes = {}));
/** All the states the tokenizer can be in. */
var State;
(function(State) {
	State[State["Text"] = 1] = "Text";
	State[State["BeforeTagName"] = 2] = "BeforeTagName";
	State[State["InTagName"] = 3] = "InTagName";
	State[State["InSelfClosingTag"] = 4] = "InSelfClosingTag";
	State[State["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
	State[State["InClosingTagName"] = 6] = "InClosingTagName";
	State[State["AfterClosingTagName"] = 7] = "AfterClosingTagName";
	State[State["BeforeAttributeName"] = 8] = "BeforeAttributeName";
	State[State["InAttributeName"] = 9] = "InAttributeName";
	State[State["AfterAttributeName"] = 10] = "AfterAttributeName";
	State[State["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
	State[State["InAttributeValueDq"] = 12] = "InAttributeValueDq";
	State[State["InAttributeValueSq"] = 13] = "InAttributeValueSq";
	State[State["InAttributeValueNq"] = 14] = "InAttributeValueNq";
	State[State["BeforeDeclaration"] = 15] = "BeforeDeclaration";
	State[State["InDeclaration"] = 16] = "InDeclaration";
	State[State["InProcessingInstruction"] = 17] = "InProcessingInstruction";
	State[State["BeforeComment"] = 18] = "BeforeComment";
	State[State["CDATASequence"] = 19] = "CDATASequence";
	State[State["InSpecialComment"] = 20] = "InSpecialComment";
	State[State["InCommentLike"] = 21] = "InCommentLike";
	State[State["BeforeSpecialS"] = 22] = "BeforeSpecialS";
	State[State["BeforeSpecialT"] = 23] = "BeforeSpecialT";
	State[State["SpecialStartSequence"] = 24] = "SpecialStartSequence";
	State[State["InSpecialTag"] = 25] = "InSpecialTag";
	State[State["InEntity"] = 26] = "InEntity";
})(State || (State = {}));
function isWhitespace(c) {
	return c === CharCodes.Space || c === CharCodes.NewLine || c === CharCodes.Tab || c === CharCodes.FormFeed || c === CharCodes.CarriageReturn;
}
function isEndOfTagSection(c) {
	return c === CharCodes.Slash || c === CharCodes.Gt || isWhitespace(c);
}
function isASCIIAlpha(c) {
	return c >= CharCodes.LowerA && c <= CharCodes.LowerZ || c >= CharCodes.UpperA && c <= CharCodes.UpperZ;
}
var QuoteType;
(function(QuoteType) {
	QuoteType[QuoteType["NoValue"] = 0] = "NoValue";
	QuoteType[QuoteType["Unquoted"] = 1] = "Unquoted";
	QuoteType[QuoteType["Single"] = 2] = "Single";
	QuoteType[QuoteType["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
/**
* Sequences used to match longer strings.
*
* We don't have `Script`, `Style`, or `Title` here. Instead, we re-use the *End
* sequences with an increased offset.
*/
var Sequences = {
	Cdata: new Uint8Array([
		67,
		68,
		65,
		84,
		65,
		91
	]),
	CdataEnd: new Uint8Array([
		93,
		93,
		62
	]),
	CommentEnd: new Uint8Array([
		45,
		45,
		62
	]),
	ScriptEnd: new Uint8Array([
		60,
		47,
		115,
		99,
		114,
		105,
		112,
		116
	]),
	StyleEnd: new Uint8Array([
		60,
		47,
		115,
		116,
		121,
		108,
		101
	]),
	TitleEnd: new Uint8Array([
		60,
		47,
		116,
		105,
		116,
		108,
		101
	]),
	TextareaEnd: new Uint8Array([
		60,
		47,
		116,
		101,
		120,
		116,
		97,
		114,
		101,
		97
	]),
	XmpEnd: new Uint8Array([
		60,
		47,
		120,
		109,
		112
	])
};
var Tokenizer = class {
	constructor({ xmlMode = false, decodeEntities = true }, cbs) {
		this.cbs = cbs;
		/** The current state the tokenizer is in. */
		this.state = State.Text;
		/** The read buffer. */
		this.buffer = "";
		/** The beginning of the section that is currently being read. */
		this.sectionStart = 0;
		/** The index within the buffer that we are currently looking at. */
		this.index = 0;
		/** The start of the last entity. */
		this.entityStart = 0;
		/** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
		this.baseState = State.Text;
		/** For special parsing behavior inside of script and style tags. */
		this.isSpecial = false;
		/** Indicates whether the tokenizer has been paused. */
		this.running = true;
		/** The offset of the current buffer. */
		this.offset = 0;
		this.currentSequence = void 0;
		this.sequenceIndex = 0;
		this.xmlMode = xmlMode;
		this.decodeEntities = decodeEntities;
		this.entityDecoder = new EntityDecoder(xmlMode ? xmlDecodeTree : htmlDecodeTree, (cp, consumed) => this.emitCodePoint(cp, consumed));
	}
	reset() {
		this.state = State.Text;
		this.buffer = "";
		this.sectionStart = 0;
		this.index = 0;
		this.baseState = State.Text;
		this.currentSequence = void 0;
		this.running = true;
		this.offset = 0;
	}
	write(chunk) {
		this.offset += this.buffer.length;
		this.buffer = chunk;
		this.parse();
	}
	end() {
		if (this.running) this.finish();
	}
	pause() {
		this.running = false;
	}
	resume() {
		this.running = true;
		if (this.index < this.buffer.length + this.offset) this.parse();
	}
	stateText(c) {
		if (c === CharCodes.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes.Lt)) {
			if (this.index > this.sectionStart) this.cbs.ontext(this.sectionStart, this.index);
			this.state = State.BeforeTagName;
			this.sectionStart = this.index;
		} else if (this.decodeEntities && c === CharCodes.Amp) this.startEntity();
	}
	stateSpecialStartSequence(c) {
		const isEnd = this.sequenceIndex === this.currentSequence.length;
		if (!(isEnd ? isEndOfTagSection(c) : (c | 32) === this.currentSequence[this.sequenceIndex])) this.isSpecial = false;
		else if (!isEnd) {
			this.sequenceIndex++;
			return;
		}
		this.sequenceIndex = 0;
		this.state = State.InTagName;
		this.stateInTagName(c);
	}
	/** Look for an end tag. For <title> tags, also decode entities. */
	stateInSpecialTag(c) {
		if (this.sequenceIndex === this.currentSequence.length) {
			if (c === CharCodes.Gt || isWhitespace(c)) {
				const endOfText = this.index - this.currentSequence.length;
				if (this.sectionStart < endOfText) {
					const actualIndex = this.index;
					this.index = endOfText;
					this.cbs.ontext(this.sectionStart, endOfText);
					this.index = actualIndex;
				}
				this.isSpecial = false;
				this.sectionStart = endOfText + 2;
				this.stateInClosingTagName(c);
				return;
			}
			this.sequenceIndex = 0;
		}
		if ((c | 32) === this.currentSequence[this.sequenceIndex]) this.sequenceIndex += 1;
		else if (this.sequenceIndex === 0) {
			if (this.currentSequence === Sequences.TitleEnd) {
				if (this.decodeEntities && c === CharCodes.Amp) this.startEntity();
			} else if (this.fastForwardTo(CharCodes.Lt)) this.sequenceIndex = 1;
		} else this.sequenceIndex = Number(c === CharCodes.Lt);
	}
	stateCDATASequence(c) {
		if (c === Sequences.Cdata[this.sequenceIndex]) {
			if (++this.sequenceIndex === Sequences.Cdata.length) {
				this.state = State.InCommentLike;
				this.currentSequence = Sequences.CdataEnd;
				this.sequenceIndex = 0;
				this.sectionStart = this.index + 1;
			}
		} else {
			this.sequenceIndex = 0;
			this.state = State.InDeclaration;
			this.stateInDeclaration(c);
		}
	}
	/**
	* When we wait for one specific character, we can speed things up
	* by skipping through the buffer until we find it.
	*
	* @returns Whether the character was found.
	*/
	fastForwardTo(c) {
		while (++this.index < this.buffer.length + this.offset) if (this.buffer.charCodeAt(this.index - this.offset) === c) return true;
		this.index = this.buffer.length + this.offset - 1;
		return false;
	}
	/**
	* Comments and CDATA end with `-->` and `]]>`.
	*
	* Their common qualities are:
	* - Their end sequences have a distinct character they start with.
	* - That character is then repeated, so we have to check multiple repeats.
	* - All characters but the start character of the sequence can be skipped.
	*/
	stateInCommentLike(c) {
		if (c === this.currentSequence[this.sequenceIndex]) {
			if (++this.sequenceIndex === this.currentSequence.length) {
				if (this.currentSequence === Sequences.CdataEnd) this.cbs.oncdata(this.sectionStart, this.index, 2);
				else this.cbs.oncomment(this.sectionStart, this.index, 2);
				this.sequenceIndex = 0;
				this.sectionStart = this.index + 1;
				this.state = State.Text;
			}
		} else if (this.sequenceIndex === 0) {
			if (this.fastForwardTo(this.currentSequence[0])) this.sequenceIndex = 1;
		} else if (c !== this.currentSequence[this.sequenceIndex - 1]) this.sequenceIndex = 0;
	}
	/**
	* HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
	*
	* XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
	* We allow anything that wouldn't end the tag.
	*/
	isTagStartChar(c) {
		return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
	}
	startSpecial(sequence, offset) {
		this.isSpecial = true;
		this.currentSequence = sequence;
		this.sequenceIndex = offset;
		this.state = State.SpecialStartSequence;
	}
	stateBeforeTagName(c) {
		if (c === CharCodes.ExclamationMark) {
			this.state = State.BeforeDeclaration;
			this.sectionStart = this.index + 1;
		} else if (c === CharCodes.Questionmark) {
			this.state = State.InProcessingInstruction;
			this.sectionStart = this.index + 1;
		} else if (this.isTagStartChar(c)) {
			const lower = c | 32;
			this.sectionStart = this.index;
			if (this.xmlMode) this.state = State.InTagName;
			else if (lower === Sequences.ScriptEnd[2]) this.state = State.BeforeSpecialS;
			else if (lower === Sequences.TitleEnd[2] || lower === Sequences.XmpEnd[2]) this.state = State.BeforeSpecialT;
			else this.state = State.InTagName;
		} else if (c === CharCodes.Slash) this.state = State.BeforeClosingTagName;
		else {
			this.state = State.Text;
			this.stateText(c);
		}
	}
	stateInTagName(c) {
		if (isEndOfTagSection(c)) {
			this.cbs.onopentagname(this.sectionStart, this.index);
			this.sectionStart = -1;
			this.state = State.BeforeAttributeName;
			this.stateBeforeAttributeName(c);
		}
	}
	stateBeforeClosingTagName(c) {
		if (isWhitespace(c)) {} else if (c === CharCodes.Gt) this.state = State.Text;
		else {
			this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
			this.sectionStart = this.index;
		}
	}
	stateInClosingTagName(c) {
		if (c === CharCodes.Gt || isWhitespace(c)) {
			this.cbs.onclosetag(this.sectionStart, this.index);
			this.sectionStart = -1;
			this.state = State.AfterClosingTagName;
			this.stateAfterClosingTagName(c);
		}
	}
	stateAfterClosingTagName(c) {
		if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
			this.state = State.Text;
			this.sectionStart = this.index + 1;
		}
	}
	stateBeforeAttributeName(c) {
		if (c === CharCodes.Gt) {
			this.cbs.onopentagend(this.index);
			if (this.isSpecial) {
				this.state = State.InSpecialTag;
				this.sequenceIndex = 0;
			} else this.state = State.Text;
			this.sectionStart = this.index + 1;
		} else if (c === CharCodes.Slash) this.state = State.InSelfClosingTag;
		else if (!isWhitespace(c)) {
			this.state = State.InAttributeName;
			this.sectionStart = this.index;
		}
	}
	stateInSelfClosingTag(c) {
		if (c === CharCodes.Gt) {
			this.cbs.onselfclosingtag(this.index);
			this.state = State.Text;
			this.sectionStart = this.index + 1;
			this.isSpecial = false;
		} else if (!isWhitespace(c)) {
			this.state = State.BeforeAttributeName;
			this.stateBeforeAttributeName(c);
		}
	}
	stateInAttributeName(c) {
		if (c === CharCodes.Eq || isEndOfTagSection(c)) {
			this.cbs.onattribname(this.sectionStart, this.index);
			this.sectionStart = this.index;
			this.state = State.AfterAttributeName;
			this.stateAfterAttributeName(c);
		}
	}
	stateAfterAttributeName(c) {
		if (c === CharCodes.Eq) this.state = State.BeforeAttributeValue;
		else if (c === CharCodes.Slash || c === CharCodes.Gt) {
			this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
			this.sectionStart = -1;
			this.state = State.BeforeAttributeName;
			this.stateBeforeAttributeName(c);
		} else if (!isWhitespace(c)) {
			this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
			this.state = State.InAttributeName;
			this.sectionStart = this.index;
		}
	}
	stateBeforeAttributeValue(c) {
		if (c === CharCodes.DoubleQuote) {
			this.state = State.InAttributeValueDq;
			this.sectionStart = this.index + 1;
		} else if (c === CharCodes.SingleQuote) {
			this.state = State.InAttributeValueSq;
			this.sectionStart = this.index + 1;
		} else if (!isWhitespace(c)) {
			this.sectionStart = this.index;
			this.state = State.InAttributeValueNq;
			this.stateInAttributeValueNoQuotes(c);
		}
	}
	handleInAttributeValue(c, quote) {
		if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
			this.cbs.onattribdata(this.sectionStart, this.index);
			this.sectionStart = -1;
			this.cbs.onattribend(quote === CharCodes.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index + 1);
			this.state = State.BeforeAttributeName;
		} else if (this.decodeEntities && c === CharCodes.Amp) this.startEntity();
	}
	stateInAttributeValueDoubleQuotes(c) {
		this.handleInAttributeValue(c, CharCodes.DoubleQuote);
	}
	stateInAttributeValueSingleQuotes(c) {
		this.handleInAttributeValue(c, CharCodes.SingleQuote);
	}
	stateInAttributeValueNoQuotes(c) {
		if (isWhitespace(c) || c === CharCodes.Gt) {
			this.cbs.onattribdata(this.sectionStart, this.index);
			this.sectionStart = -1;
			this.cbs.onattribend(QuoteType.Unquoted, this.index);
			this.state = State.BeforeAttributeName;
			this.stateBeforeAttributeName(c);
		} else if (this.decodeEntities && c === CharCodes.Amp) this.startEntity();
	}
	stateBeforeDeclaration(c) {
		if (c === CharCodes.OpeningSquareBracket) {
			this.state = State.CDATASequence;
			this.sequenceIndex = 0;
		} else this.state = c === CharCodes.Dash ? State.BeforeComment : State.InDeclaration;
	}
	stateInDeclaration(c) {
		if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
			this.cbs.ondeclaration(this.sectionStart, this.index);
			this.state = State.Text;
			this.sectionStart = this.index + 1;
		}
	}
	stateInProcessingInstruction(c) {
		if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
			this.cbs.onprocessinginstruction(this.sectionStart, this.index);
			this.state = State.Text;
			this.sectionStart = this.index + 1;
		}
	}
	stateBeforeComment(c) {
		if (c === CharCodes.Dash) {
			this.state = State.InCommentLike;
			this.currentSequence = Sequences.CommentEnd;
			this.sequenceIndex = 2;
			this.sectionStart = this.index + 1;
		} else this.state = State.InDeclaration;
	}
	stateInSpecialComment(c) {
		if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
			this.cbs.oncomment(this.sectionStart, this.index, 0);
			this.state = State.Text;
			this.sectionStart = this.index + 1;
		}
	}
	stateBeforeSpecialS(c) {
		const lower = c | 32;
		if (lower === Sequences.ScriptEnd[3]) this.startSpecial(Sequences.ScriptEnd, 4);
		else if (lower === Sequences.StyleEnd[3]) this.startSpecial(Sequences.StyleEnd, 4);
		else {
			this.state = State.InTagName;
			this.stateInTagName(c);
		}
	}
	stateBeforeSpecialT(c) {
		switch (c | 32) {
			case Sequences.TitleEnd[3]:
				this.startSpecial(Sequences.TitleEnd, 4);
				break;
			case Sequences.TextareaEnd[3]:
				this.startSpecial(Sequences.TextareaEnd, 4);
				break;
			case Sequences.XmpEnd[3]:
				this.startSpecial(Sequences.XmpEnd, 4);
				break;
			default:
				this.state = State.InTagName;
				this.stateInTagName(c);
		}
	}
	startEntity() {
		this.baseState = this.state;
		this.state = State.InEntity;
		this.entityStart = this.index;
		this.entityDecoder.startEntity(this.xmlMode ? DecodingMode.Strict : this.baseState === State.Text || this.baseState === State.InSpecialTag ? DecodingMode.Legacy : DecodingMode.Attribute);
	}
	stateInEntity() {
		const indexInBuffer = this.index - this.offset;
		const length = this.entityDecoder.write(this.buffer, indexInBuffer);
		if (length >= 0) {
			this.state = this.baseState;
			if (length === 0) this.index -= 1;
		} else {
			if (indexInBuffer < this.buffer.length && this.buffer.charCodeAt(indexInBuffer) === CharCodes.Amp) {
				this.state = this.baseState;
				this.index -= 1;
				return;
			}
			this.index = this.offset + this.buffer.length - 1;
		}
	}
	/**
	* Remove data that has already been consumed from the buffer.
	*/
	cleanup() {
		if (this.running && this.sectionStart !== this.index) {
			if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
				this.cbs.ontext(this.sectionStart, this.index);
				this.sectionStart = this.index;
			} else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
				this.cbs.onattribdata(this.sectionStart, this.index);
				this.sectionStart = this.index;
			}
		}
	}
	shouldContinue() {
		return this.index < this.buffer.length + this.offset && this.running;
	}
	/**
	* Iterates through the buffer, calling the function corresponding to the current state.
	*
	* States that are more likely to be hit are higher up, as a performance improvement.
	*/
	parse() {
		while (this.shouldContinue()) {
			const c = this.buffer.charCodeAt(this.index - this.offset);
			switch (this.state) {
				case State.Text:
					this.stateText(c);
					break;
				case State.SpecialStartSequence:
					this.stateSpecialStartSequence(c);
					break;
				case State.InSpecialTag:
					this.stateInSpecialTag(c);
					break;
				case State.CDATASequence:
					this.stateCDATASequence(c);
					break;
				case State.InAttributeValueDq:
					this.stateInAttributeValueDoubleQuotes(c);
					break;
				case State.InAttributeName:
					this.stateInAttributeName(c);
					break;
				case State.InCommentLike:
					this.stateInCommentLike(c);
					break;
				case State.InSpecialComment:
					this.stateInSpecialComment(c);
					break;
				case State.BeforeAttributeName:
					this.stateBeforeAttributeName(c);
					break;
				case State.InTagName:
					this.stateInTagName(c);
					break;
				case State.InClosingTagName:
					this.stateInClosingTagName(c);
					break;
				case State.BeforeTagName:
					this.stateBeforeTagName(c);
					break;
				case State.AfterAttributeName:
					this.stateAfterAttributeName(c);
					break;
				case State.InAttributeValueSq:
					this.stateInAttributeValueSingleQuotes(c);
					break;
				case State.BeforeAttributeValue:
					this.stateBeforeAttributeValue(c);
					break;
				case State.BeforeClosingTagName:
					this.stateBeforeClosingTagName(c);
					break;
				case State.AfterClosingTagName:
					this.stateAfterClosingTagName(c);
					break;
				case State.BeforeSpecialS:
					this.stateBeforeSpecialS(c);
					break;
				case State.BeforeSpecialT:
					this.stateBeforeSpecialT(c);
					break;
				case State.InAttributeValueNq:
					this.stateInAttributeValueNoQuotes(c);
					break;
				case State.InSelfClosingTag:
					this.stateInSelfClosingTag(c);
					break;
				case State.InDeclaration:
					this.stateInDeclaration(c);
					break;
				case State.BeforeDeclaration:
					this.stateBeforeDeclaration(c);
					break;
				case State.BeforeComment:
					this.stateBeforeComment(c);
					break;
				case State.InProcessingInstruction:
					this.stateInProcessingInstruction(c);
					break;
				case State.InEntity: this.stateInEntity();
			}
			this.index++;
		}
		this.cleanup();
	}
	finish() {
		if (this.state === State.InEntity) {
			this.entityDecoder.end();
			this.state = this.baseState;
		}
		this.handleTrailingData();
		this.cbs.onend();
	}
	/** Handle any trailing data. */
	handleTrailingData() {
		const endIndex = this.buffer.length + this.offset;
		if (this.sectionStart >= endIndex) return;
		if (this.state === State.InCommentLike) if (this.currentSequence === Sequences.CdataEnd) this.cbs.oncdata(this.sectionStart, endIndex, 0);
		else this.cbs.oncomment(this.sectionStart, endIndex, 0);
		else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {} else this.cbs.ontext(this.sectionStart, endIndex);
	}
	emitCodePoint(cp, consumed) {
		if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
			if (this.sectionStart < this.entityStart) this.cbs.onattribdata(this.sectionStart, this.entityStart);
			this.sectionStart = this.entityStart + consumed;
			this.index = this.sectionStart - 1;
			this.cbs.onattribentity(cp);
		} else {
			if (this.sectionStart < this.entityStart) this.cbs.ontext(this.sectionStart, this.entityStart);
			this.sectionStart = this.entityStart + consumed;
			this.index = this.sectionStart - 1;
			this.cbs.ontextentity(cp, this.sectionStart);
		}
	}
};
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/htmlparser2/dist/esm/Parser.js
var formTags = /* @__PURE__ */ new Set([
	"input",
	"option",
	"optgroup",
	"select",
	"button",
	"datalist",
	"textarea"
]);
var pTag = /* @__PURE__ */ new Set(["p"]);
var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
var openImpliesClose = /* @__PURE__ */ new Map([
	["tr", /* @__PURE__ */ new Set([
		"tr",
		"th",
		"td"
	])],
	["th", /* @__PURE__ */ new Set(["th"])],
	["td", /* @__PURE__ */ new Set([
		"thead",
		"th",
		"td"
	])],
	["body", /* @__PURE__ */ new Set([
		"head",
		"link",
		"script"
	])],
	["li", /* @__PURE__ */ new Set(["li"])],
	["p", pTag],
	["h1", pTag],
	["h2", pTag],
	["h3", pTag],
	["h4", pTag],
	["h5", pTag],
	["h6", pTag],
	["select", formTags],
	["input", formTags],
	["output", formTags],
	["button", formTags],
	["datalist", formTags],
	["textarea", formTags],
	["option", /* @__PURE__ */ new Set(["option"])],
	["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
	["dd", ddtTags],
	["dt", ddtTags],
	["address", pTag],
	["article", pTag],
	["aside", pTag],
	["blockquote", pTag],
	["details", pTag],
	["div", pTag],
	["dl", pTag],
	["fieldset", pTag],
	["figcaption", pTag],
	["figure", pTag],
	["footer", pTag],
	["form", pTag],
	["header", pTag],
	["hr", pTag],
	["main", pTag],
	["nav", pTag],
	["ol", pTag],
	["pre", pTag],
	["section", pTag],
	["table", pTag],
	["ul", pTag],
	["rt", rtpTags],
	["rp", rtpTags],
	["tbody", tableSectionTags],
	["tfoot", tableSectionTags]
]);
var voidElements = /* @__PURE__ */ new Set([
	"area",
	"base",
	"basefont",
	"br",
	"col",
	"command",
	"embed",
	"frame",
	"hr",
	"img",
	"input",
	"isindex",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]);
var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
var htmlIntegrationElements = /* @__PURE__ */ new Set([
	"mi",
	"mo",
	"mn",
	"ms",
	"mtext",
	"annotation-xml",
	"foreignobject",
	"desc",
	"title"
]);
var reNameEnd = /\s|\//;
var Parser = class {
	constructor(cbs, options = {}) {
		var _a, _b, _c, _d, _e, _f;
		this.options = options;
		/** The start index of the last event. */
		this.startIndex = 0;
		/** The end index of the last event. */
		this.endIndex = 0;
		/**
		* Store the start index of the current open tag,
		* so we can update the start index for attributes.
		*/
		this.openTagStart = 0;
		this.tagname = "";
		this.attribname = "";
		this.attribvalue = "";
		this.attribs = null;
		this.stack = [];
		this.buffers = [];
		this.bufferOffset = 0;
		/** The index of the last written buffer. Used when resuming after a `pause()`. */
		this.writeIndex = 0;
		/** Indicates whether the parser has finished running / `.end` has been called. */
		this.ended = false;
		this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
		this.htmlMode = !this.options.xmlMode;
		this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : this.htmlMode;
		this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : this.htmlMode;
		this.recognizeSelfClosing = (_c = options.recognizeSelfClosing) !== null && _c !== void 0 ? _c : !this.htmlMode;
		this.tokenizer = new ((_d = options.Tokenizer) !== null && _d !== void 0 ? _d : Tokenizer)(this.options, this);
		this.foreignContext = [!this.htmlMode];
		(_f = (_e = this.cbs).onparserinit) === null || _f === void 0 || _f.call(_e, this);
	}
	/** @internal */
	ontext(start, endIndex) {
		var _a, _b;
		const data = this.getSlice(start, endIndex);
		this.endIndex = endIndex - 1;
		(_b = (_a = this.cbs).ontext) === null || _b === void 0 || _b.call(_a, data);
		this.startIndex = endIndex;
	}
	/** @internal */
	ontextentity(cp, endIndex) {
		var _a, _b;
		this.endIndex = endIndex - 1;
		(_b = (_a = this.cbs).ontext) === null || _b === void 0 || _b.call(_a, fromCodePoint(cp));
		this.startIndex = endIndex;
	}
	/**
	* Checks if the current tag is a void element. Override this if you want
	* to specify your own additional void elements.
	*/
	isVoidElement(name) {
		return this.htmlMode && voidElements.has(name);
	}
	/** @internal */
	onopentagname(start, endIndex) {
		this.endIndex = endIndex;
		let name = this.getSlice(start, endIndex);
		if (this.lowerCaseTagNames) name = name.toLowerCase();
		this.emitOpenTag(name);
	}
	emitOpenTag(name) {
		var _a, _b, _c, _d;
		this.openTagStart = this.startIndex;
		this.tagname = name;
		const impliesClose = this.htmlMode && openImpliesClose.get(name);
		if (impliesClose) while (this.stack.length > 0 && impliesClose.has(this.stack[0])) {
			const element = this.stack.shift();
			(_b = (_a = this.cbs).onclosetag) === null || _b === void 0 || _b.call(_a, element, true);
		}
		if (!this.isVoidElement(name)) {
			this.stack.unshift(name);
			if (this.htmlMode) {
				if (foreignContextElements.has(name)) this.foreignContext.unshift(true);
				else if (htmlIntegrationElements.has(name)) this.foreignContext.unshift(false);
			}
		}
		(_d = (_c = this.cbs).onopentagname) === null || _d === void 0 || _d.call(_c, name);
		if (this.cbs.onopentag) this.attribs = {};
	}
	endOpenTag(isImplied) {
		var _a, _b;
		this.startIndex = this.openTagStart;
		if (this.attribs) {
			(_b = (_a = this.cbs).onopentag) === null || _b === void 0 || _b.call(_a, this.tagname, this.attribs, isImplied);
			this.attribs = null;
		}
		if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) this.cbs.onclosetag(this.tagname, true);
		this.tagname = "";
	}
	/** @internal */
	onopentagend(endIndex) {
		this.endIndex = endIndex;
		this.endOpenTag(false);
		this.startIndex = endIndex + 1;
	}
	/** @internal */
	onclosetag(start, endIndex) {
		var _a, _b, _c, _d, _e, _f, _g, _h;
		this.endIndex = endIndex;
		let name = this.getSlice(start, endIndex);
		if (this.lowerCaseTagNames) name = name.toLowerCase();
		if (this.htmlMode && (foreignContextElements.has(name) || htmlIntegrationElements.has(name))) this.foreignContext.shift();
		if (!this.isVoidElement(name)) {
			const pos = this.stack.indexOf(name);
			if (pos !== -1) for (let index = 0; index <= pos; index++) {
				const element = this.stack.shift();
				(_b = (_a = this.cbs).onclosetag) === null || _b === void 0 || _b.call(_a, element, index !== pos);
			}
			else if (this.htmlMode && name === "p") {
				this.emitOpenTag("p");
				this.closeCurrentTag(true);
			}
		} else if (this.htmlMode && name === "br") {
			(_d = (_c = this.cbs).onopentagname) === null || _d === void 0 || _d.call(_c, "br");
			(_f = (_e = this.cbs).onopentag) === null || _f === void 0 || _f.call(_e, "br", {}, true);
			(_h = (_g = this.cbs).onclosetag) === null || _h === void 0 || _h.call(_g, "br", false);
		}
		this.startIndex = endIndex + 1;
	}
	/** @internal */
	onselfclosingtag(endIndex) {
		this.endIndex = endIndex;
		if (this.recognizeSelfClosing || this.foreignContext[0]) {
			this.closeCurrentTag(false);
			this.startIndex = endIndex + 1;
		} else this.onopentagend(endIndex);
	}
	closeCurrentTag(isOpenImplied) {
		var _a, _b;
		const name = this.tagname;
		this.endOpenTag(isOpenImplied);
		if (this.stack[0] === name) {
			(_b = (_a = this.cbs).onclosetag) === null || _b === void 0 || _b.call(_a, name, !isOpenImplied);
			this.stack.shift();
		}
	}
	/** @internal */
	onattribname(start, endIndex) {
		this.startIndex = start;
		const name = this.getSlice(start, endIndex);
		this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
	}
	/** @internal */
	onattribdata(start, endIndex) {
		this.attribvalue += this.getSlice(start, endIndex);
	}
	/** @internal */
	onattribentity(cp) {
		this.attribvalue += fromCodePoint(cp);
	}
	/** @internal */
	onattribend(quote, endIndex) {
		var _a, _b;
		this.endIndex = endIndex;
		(_b = (_a = this.cbs).onattribute) === null || _b === void 0 || _b.call(_a, this.attribname, this.attribvalue, quote === QuoteType.Double ? "\"" : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
		if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) this.attribs[this.attribname] = this.attribvalue;
		this.attribvalue = "";
	}
	getInstructionName(value) {
		const index = value.search(reNameEnd);
		let name = index < 0 ? value : value.substr(0, index);
		if (this.lowerCaseTagNames) name = name.toLowerCase();
		return name;
	}
	/** @internal */
	ondeclaration(start, endIndex) {
		this.endIndex = endIndex;
		const value = this.getSlice(start, endIndex);
		if (this.cbs.onprocessinginstruction) {
			const name = this.getInstructionName(value);
			this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
		}
		this.startIndex = endIndex + 1;
	}
	/** @internal */
	onprocessinginstruction(start, endIndex) {
		this.endIndex = endIndex;
		const value = this.getSlice(start, endIndex);
		if (this.cbs.onprocessinginstruction) {
			const name = this.getInstructionName(value);
			this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
		}
		this.startIndex = endIndex + 1;
	}
	/** @internal */
	oncomment(start, endIndex, offset) {
		var _a, _b, _c, _d;
		this.endIndex = endIndex;
		(_b = (_a = this.cbs).oncomment) === null || _b === void 0 || _b.call(_a, this.getSlice(start, endIndex - offset));
		(_d = (_c = this.cbs).oncommentend) === null || _d === void 0 || _d.call(_c);
		this.startIndex = endIndex + 1;
	}
	/** @internal */
	oncdata(start, endIndex, offset) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
		this.endIndex = endIndex;
		const value = this.getSlice(start, endIndex - offset);
		if (!this.htmlMode || this.options.recognizeCDATA) {
			(_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 || _b.call(_a);
			(_d = (_c = this.cbs).ontext) === null || _d === void 0 || _d.call(_c, value);
			(_f = (_e = this.cbs).oncdataend) === null || _f === void 0 || _f.call(_e);
		} else {
			(_h = (_g = this.cbs).oncomment) === null || _h === void 0 || _h.call(_g, `[CDATA[${value}]]`);
			(_k = (_j = this.cbs).oncommentend) === null || _k === void 0 || _k.call(_j);
		}
		this.startIndex = endIndex + 1;
	}
	/** @internal */
	onend() {
		var _a, _b;
		if (this.cbs.onclosetag) {
			this.endIndex = this.startIndex;
			for (let index = 0; index < this.stack.length; index++) this.cbs.onclosetag(this.stack[index], true);
		}
		(_b = (_a = this.cbs).onend) === null || _b === void 0 || _b.call(_a);
	}
	/**
	* Resets the parser to a blank state, ready to parse a new HTML document
	*/
	reset() {
		var _a, _b, _c, _d;
		(_b = (_a = this.cbs).onreset) === null || _b === void 0 || _b.call(_a);
		this.tokenizer.reset();
		this.tagname = "";
		this.attribname = "";
		this.attribs = null;
		this.stack.length = 0;
		this.startIndex = 0;
		this.endIndex = 0;
		(_d = (_c = this.cbs).onparserinit) === null || _d === void 0 || _d.call(_c, this);
		this.buffers.length = 0;
		this.foreignContext.length = 0;
		this.foreignContext.unshift(!this.htmlMode);
		this.bufferOffset = 0;
		this.writeIndex = 0;
		this.ended = false;
	}
	/**
	* Resets the parser, then parses a complete document and
	* pushes it to the handler.
	*
	* @param data Document to parse.
	*/
	parseComplete(data) {
		this.reset();
		this.end(data);
	}
	getSlice(start, end) {
		while (start - this.bufferOffset >= this.buffers[0].length) this.shiftBuffer();
		let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
		while (end - this.bufferOffset > this.buffers[0].length) {
			this.shiftBuffer();
			slice += this.buffers[0].slice(0, end - this.bufferOffset);
		}
		return slice;
	}
	shiftBuffer() {
		this.bufferOffset += this.buffers[0].length;
		this.writeIndex--;
		this.buffers.shift();
	}
	/**
	* Parses a chunk of data and calls the corresponding callbacks.
	*
	* @param chunk Chunk to parse.
	*/
	write(chunk) {
		var _a, _b;
		if (this.ended) {
			(_b = (_a = this.cbs).onerror) === null || _b === void 0 || _b.call(_a, /* @__PURE__ */ new Error(".write() after done!"));
			return;
		}
		this.buffers.push(chunk);
		if (this.tokenizer.running) {
			this.tokenizer.write(chunk);
			this.writeIndex++;
		}
	}
	/**
	* Parses the end of the buffer and clears the stack, calls onend.
	*
	* @param chunk Optional final chunk to parse.
	*/
	end(chunk) {
		var _a, _b;
		if (this.ended) {
			(_b = (_a = this.cbs).onerror) === null || _b === void 0 || _b.call(_a, /* @__PURE__ */ new Error(".end() after done!"));
			return;
		}
		if (chunk) this.write(chunk);
		this.ended = true;
		this.tokenizer.end();
	}
	/**
	* Pauses parsing. The parser won't emit events until `resume` is called.
	*/
	pause() {
		this.tokenizer.pause();
	}
	/**
	* Resumes parsing after `pause` was called.
	*/
	resume() {
		this.tokenizer.resume();
		while (this.tokenizer.running && this.writeIndex < this.buffers.length) this.tokenizer.write(this.buffers[this.writeIndex++]);
		if (this.ended) this.tokenizer.end();
	}
	/**
	* Alias of `write`, for backwards compatibility.
	*
	* @param chunk Chunk to parse.
	* @deprecated
	*/
	parseChunk(chunk) {
		this.write(chunk);
	}
	/**
	* Alias of `end`, for backwards compatibility.
	*
	* @param chunk Optional final chunk to parse.
	* @deprecated
	*/
	done(chunk) {
		this.end(chunk);
	}
};
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/htmlparser2/dist/esm/index.js
/**
* Parses the data, returns the resulting document.
*
* @param data The data that should be parsed.
* @param options Optional options for the parser and DOM handler.
*/
function parseDocument(data, options) {
	const handler = new DomHandler(void 0, options);
	new Parser(handler, options).end(data);
	return handler.root;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/deepmerge-ts/dist/index.mjs
/**
* Special values that tell deepmerge to perform a certain action.
*/
var actions = {
	defaultMerge: Symbol("deepmerge-ts: default merge"),
	skip: Symbol("deepmerge-ts: skip")
};
actions.defaultMerge;
/**
* The default function to update meta data.
*
* It builds and updates the hierarchy tree.
*
* @param previousMeta - The previous meta data.
* @param mergeInfo - Meta information about the current merge state.
* @returns The updated meta data.
*/
function defaultMetaDataUpdater(previousMeta, mergeInfo) {
	const ancestor = {
		key: mergeInfo.key,
		parents: mergeInfo.parents,
		values: mergeInfo.values,
		result: mergeInfo.result
	};
	const prevHierarchy = previousMeta?.hierarchy;
	return {
		...ancestor,
		hierarchy: prevHierarchy === void 0 ? [ancestor] : [...prevHierarchy, ancestor]
	};
}
/**
* The default function to filter values.
*
* It filters out undefined values.
*
* @param values - The values to filter.
* @param meta - The meta data.
* @returns The filtered values.
*/
function defaultFilterValues(values, meta) {
	return values.includes(void 0) ? values.filter((value) => value !== void 0) : values;
}
/**
* Check if the custom merge result should fall back to the default merge function.
*
* @param utils - The utils.
* @param fallback - The name of the fallback merge function.
* @param result - The result of the custom merge function.
* @returns Whether to use the default merge function.
*/
function shouldFallbackToDefault(utils, fallback, result) {
	return result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions[fallback] !== utils.defaultMergeFunctions[fallback];
}
/**
* Resolve custom merge functions from user options.
*
* @param options - The options passed by the user.
* @param defaultMergeFunctions - The default merge functions.
* @returns The resolved merge functions.
*/
function resolveCustomMergeFunctions(options, defaultMergeFunctions) {
	return {
		...defaultMergeFunctions,
		...Object.fromEntries(Object.entries(options).filter(([key]) => Object.hasOwn(defaultMergeFunctions, key)).map(([key, option]) => option === false ? [key, defaultMergeFunctions.mergeOthers] : typeof option === "function" ? [key, option] : [key, defaultMergeFunctions[key]]))
	};
}
/**
* The default strategy to merge arrays.
*
* @param values - The arrays.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged array.
*/
function mergeArrays$1(values, utils, meta) {
	return values.flat();
}
/**
* The default strategy to merge sets.
*
* @param values - The sets.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged set.
*/
function mergeSets$1(values, utils, meta) {
	const result = /* @__PURE__ */ new Set();
	for (const set of values) for (const element of set) result.add(element);
	return result;
}
/**
* The default strategy to merge other things.
*
* @param values - The other things.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged value.
*/
function mergeOthers$1(values, utils, meta) {
	return values.at(-1);
}
/**
* The different types of objects deepmerge-ts support.
*/
var ObjectType;
(function(ObjectType) {
	ObjectType[ObjectType["NOT"] = 0] = "NOT";
	ObjectType[ObjectType["RECORD"] = 1] = "RECORD";
	ObjectType[ObjectType["ARRAY"] = 2] = "ARRAY";
	ObjectType[ObjectType["SET"] = 3] = "SET";
	ObjectType[ObjectType["MAP"] = 4] = "MAP";
	ObjectType[ObjectType["OTHER"] = 5] = "OTHER";
})(ObjectType || (ObjectType = {}));
/**
* Get the type of the given object.
*
* @param object - The object to get the type of.
* @returns The type of the given object.
*/
function getObjectType(object) {
	if (typeof object !== "object" || object === null) return ObjectType.NOT;
	if (Array.isArray(object)) return ObjectType.ARRAY;
	if (isRecord(object)) return ObjectType.RECORD;
	if (object instanceof Set) return ObjectType.SET;
	if (object instanceof Map) return ObjectType.MAP;
	return ObjectType.OTHER;
}
/**
* Get the keys of the given objects including symbol keys.
*
* Note: Only keys to enumerable properties are returned.
*
* @param objects - An array of objects to get the keys of.
* @returns A set containing all the keys of all the given objects.
*/
function getKeysOfObjects(objects) {
	const keys = /* @__PURE__ */ new Set();
	for (const currentObject of objects) {
		const stringKeys = Object.keys(currentObject);
		for (const stringKey of stringKeys) keys.add(stringKey);
		const symbols = Object.getOwnPropertySymbols(currentObject);
		if (symbols.length > 0) {
			for (const symbol of symbols) if (Object.prototype.propertyIsEnumerable.call(currentObject, symbol)) keys.add(symbol);
		}
	}
	return keys;
}
/**
* Get the keys of the given object.
*
* Note: Only keys to enumerable properties are returned.
*
* @param object - The object to get the keys of.
* @returns The keys of the given object.
*/
function getKeysOfObject(object) {
	const symbols = Object.getOwnPropertySymbols(object).filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol));
	return [...Object.keys(object), ...symbols];
}
/**
* Does the given object have the given property.
*
* @param object - The object to test.
* @param property - The property to test.
* @returns Whether the object has the property.
*/
function objectHasProperty(object, property) {
	return typeof object === "object" && Object.prototype.propertyIsEnumerable.call(object, property);
}
/**
* Does the given object appear to be a record.
*
* @param value - The object to check.
* @returns Whether the object is a record.
*/
function isRecord(value) {
	const prototype = Object.getPrototypeOf(value);
	if (prototype === null || prototype === Object.prototype) return true;
	const objectToString = Object.prototype.toString.call(value);
	if (objectToString !== "[object Object]" && objectToString !== "[object Module]") return false;
	const { constructor } = value;
	if (constructor === void 0) return true;
	const constructorPrototype = constructor.prototype;
	if (constructorPrototype === null || typeof constructorPrototype !== "object") return false;
	const constructorToString = Object.prototype.toString.call(constructorPrototype);
	if (constructorToString !== "[object Object]" && constructorToString !== "[object Module]") return false;
	if (!Object.hasOwn(constructorPrototype, "isPrototypeOf")) return false;
	return true;
}
/**
* If the given object is a cyclic reference in its ancestor tree, return how far down the ancestor tree the object is from its first occurrence. Otherwise, return 0.
*
* @param object - The object to check.
* @param hierarchy - The hierarchy of the object.
* @param index - The index of the object (or ancestor of) within the original values passed to the merge function.
* @returns The cyclic reference depth of the object if it is a cyclic reference, or 0 if it is not.
*/
function getCyclicReferenceDepth(object, hierarchy, index) {
	if (hierarchy === void 0 || hierarchy.length === 0) return 0;
	let mut_depth = 1;
	for (let mut_index = hierarchy.length - 1; mut_index >= 0; mut_index--) {
		const { parents } = hierarchy[mut_index];
		if (parents[index] === object || parents.includes(object)) return mut_depth;
		mut_depth += 1;
	}
	return 0;
}
/**
* Get the hierarchy array from the given meta data if present.
*
* @param meta - The meta data.
* @returns The hierarchy array or undefined.
*/
function getMetaDataHierarchy(meta) {
	return meta?.hierarchy;
}
/**
* The default strategy to merge records.
*
* @param values - The records.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged records.
*/
function mergeRecords$1(values, utils, meta) {
	if (values.length === 2) {
		const result = {};
		const mergeProperty = (key, propValues) => {
			const propertyResult = mergeUnknowns(propValues, utils, utils.metaDataUpdater(meta, {
				key,
				parents: values,
				values: propValues,
				result
			}));
			if (propertyResult === actions.skip) return;
			if (key === "__proto__") Object.defineProperty(result, key, {
				value: propertyResult,
				configurable: true,
				enumerable: true,
				writable: true
			});
			else result[key] = propertyResult;
		};
		const firstValue = values[0];
		const secondValue = values[1];
		for (const key of getKeysOfObject(firstValue)) mergeProperty(key, objectHasProperty(secondValue, key) ? [firstValue[key], secondValue[key]] : [firstValue[key]]);
		for (const key of getKeysOfObject(secondValue)) if (!objectHasProperty(firstValue, key)) mergeProperty(key, [secondValue[key]]);
		return result;
	}
	return mergeRecordsGeneral(values, utils, meta);
}
/**
* The default strategy to merge 3 or more records.
*
* @param values - The records.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged records.
*/
function mergeRecordsGeneral(values, utils, meta) {
	const result = {};
	for (const key of getKeysOfObjects(values)) {
		const propValues = [];
		for (const value of values) if (objectHasProperty(value, key)) propValues.push(value[key]);
		const propertyResult = mergeUnknowns(propValues, utils, utils.metaDataUpdater(meta, {
			key,
			parents: values,
			values: propValues,
			result
		}));
		if (propertyResult === actions.skip) continue;
		if (key === "__proto__") Object.defineProperty(result, key, {
			value: propertyResult,
			configurable: true,
			enumerable: true,
			writable: true
		});
		else result[key] = propertyResult;
	}
	return result;
}
/**
* The default strategy to merge maps.
*
* @param values - The maps.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged map.
*/
function mergeMaps$1(values, utils, meta) {
	const result = /* @__PURE__ */ new Map();
	const valuesByKey = /* @__PURE__ */ new Map();
	for (const map of values) for (const [key, value] of map) {
		const mut_keyValues = valuesByKey.get(key);
		if (mut_keyValues === void 0) valuesByKey.set(key, [value]);
		else mut_keyValues.push(value);
	}
	for (const [key, keyValues] of valuesByKey) {
		const keyResult = mergeUnknowns(keyValues, utils, utils.metaDataUpdater(meta, {
			key,
			parents: values,
			values: keyValues,
			result
		}));
		if (keyResult === actions.skip) continue;
		result.set(key, keyResult);
	}
	return result;
}
/**
* Resolve any cyclic references within a non-cyclic object pointing to ancestors in meta.hierarchy.
*
* @param value - The value to resolve circular references for.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The resolved value.
*/
function resolveCyclicReferences(value, utils, meta) {
	if (typeof value !== "object" || value === null) return value;
	const hierarchy = getMetaDataHierarchy(meta);
	const depth = getCyclicReferenceDepth(value, hierarchy, 0);
	if (hierarchy !== void 0 && depth > 0) return hierarchy[hierarchy.length - depth]?.result;
	if (getObjectType(value) === ObjectType.RECORD) {
		const record = value;
		let mut_changed = false;
		const result = {};
		for (const key of getKeysOfObject(record)) {
			const propVal = record[key];
			const resolvedProp = resolveCyclicReferences(propVal, utils, utils.metaDataUpdater(meta, {
				key,
				parents: [record],
				values: [propVal],
				result
			}));
			if (resolvedProp !== propVal) mut_changed = true;
			if (key === "__proto__") Object.defineProperty(result, key, {
				value: resolvedProp,
				configurable: true,
				enumerable: true,
				writable: true
			});
			else result[key] = resolvedProp;
		}
		return mut_changed ? result : value;
	}
	return value;
}
/**
* The default strategy to merge circular references.
*
* @param values - The circular references.
* @param cyclicDepths - The depth of each circular reference.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged circular references.
*/
function mergeCircularReferences$1(values, cyclicDepths, utils, meta) {
	const depth = cyclicDepths[0];
	const hierarchy = getMetaDataHierarchy(meta);
	for (let mut_index = 1; mut_index < values.length; mut_index++) if (cyclicDepths[mut_index] !== depth) {
		const lastCyclicDepth = cyclicDepths.at(-1);
		return lastCyclicDepth === 0 ? resolveCyclicReferences(values.at(-1), utils, meta) : hierarchy?.[hierarchy.length - lastCyclicDepth]?.result;
	}
	return hierarchy?.[hierarchy.length - depth]?.result;
}
/**
* The merge functions.
*/
var mergeFunctions = {
	mergeRecords: mergeRecords$1,
	mergeArrays: mergeArrays$1,
	mergeSets: mergeSets$1,
	mergeMaps: mergeMaps$1,
	mergeCircularReferences: mergeCircularReferences$1,
	mergeOthers: mergeOthers$1
};
function deepmergeCustom(options = {}, rootMetaData) {
	const utils = getUtils$1(options, customizedDeepmerge);
	/**
	* The customized deepmerge function.
	*
	* @param objects - The objects to merge.
	* @returns The merged result.
	*/
	function customizedDeepmerge(...objects) {
		return mergeUnknowns(objects, utils, rootMetaData ?? void 0);
	}
	return customizedDeepmerge;
}
/**
* Get the utils that are available to the merge functions.
*
* @param options - The options the user specified.
* @param customizedDeepmerge - The customized deepmerge function.
* @returns The merge utils.
*/
function getUtils$1(options, customizedDeepmerge) {
	const defaultMergeFns = mergeFunctions;
	const defaultMetaDataUpd = defaultMetaDataUpdater;
	return {
		defaultMergeFunctions: defaultMergeFns,
		mergeFunctions: resolveCustomMergeFunctions(options, defaultMergeFns),
		metaDataUpdater: typeof options.metaDataUpdater === "function" ? options.metaDataUpdater : defaultMetaDataUpd,
		deepmerge: customizedDeepmerge,
		useImplicitDefaultMerging: options.enableImplicitDefaultMerging ?? false,
		filterValues: options.filterValues === false ? void 0 : typeof options.filterValues === "function" ? options.filterValues : defaultFilterValues,
		maxDepth: typeof options.maxDepth === "number" && !Number.isNaN(options.maxDepth) && options.maxDepth >= 0 ? options.maxDepth : 1e3,
		actions
	};
}
/**
* Merge unknown things.
*
* @param values - The values.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged result.
*/
function mergeUnknowns(values, utils, meta) {
	const filteredValues = utils.filterValues?.(values, meta) ?? values;
	if (filteredValues.length === 0) return;
	const hierarchy = getMetaDataHierarchy(meta);
	const currentDepth = hierarchy?.length ?? (typeof meta === "number" ? meta : meta?.depth ?? 0);
	if (utils.maxDepth !== void 0 && currentDepth >= utils.maxDepth) return mergeOthers(filteredValues, utils, meta);
	if (filteredValues.length === 1) {
		if (hierarchy !== void 0) {
			const depth = getCyclicReferenceDepth(filteredValues[0], hierarchy, 0);
			if (depth > 0) return hierarchy[hierarchy.length - depth]?.result ?? hierarchy[hierarchy.length - depth]?.parents[0];
		}
		return mergeOthers(filteredValues, utils, meta);
	}
	const type = getObjectType(filteredValues[0]);
	if (type !== ObjectType.NOT && type !== ObjectType.OTHER) if (filteredValues.length === 2) {
		if (getObjectType(filteredValues[1]) !== type) return mergeOthers(filteredValues, utils, meta);
		const d0 = getCyclicReferenceDepth(filteredValues[0], hierarchy, 0);
		const d1 = getCyclicReferenceDepth(filteredValues[1], hierarchy, 1);
		if (d0 !== 0 || d1 !== 0) return mergeCircularReferences(filteredValues, [d0, d1], utils, meta);
	} else {
		const cyclicDepths = new Array(filteredValues.length);
		cyclicDepths[0] = getCyclicReferenceDepth(filteredValues[0], hierarchy, 0);
		for (let mut_index = 1; mut_index < filteredValues.length; mut_index++) {
			if (getObjectType(filteredValues[mut_index]) !== type) return mergeOthers(filteredValues, utils, meta);
			cyclicDepths[mut_index] = getCyclicReferenceDepth(filteredValues[mut_index], hierarchy, mut_index);
		}
		if (cyclicDepths.some((depth) => depth !== 0)) return mergeCircularReferences(filteredValues, cyclicDepths, utils, meta);
	}
	switch (type) {
		case ObjectType.RECORD: return mergeRecords(filteredValues, utils, meta);
		case ObjectType.ARRAY: return mergeArrays(filteredValues, utils, meta);
		case ObjectType.SET: return mergeSets(filteredValues, utils, meta);
		case ObjectType.MAP: return mergeMaps(filteredValues, utils, meta);
		default: return mergeOthers(filteredValues, utils, meta);
	}
}
/**
* Merge records.
*
* @param values - The records.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged result.
*/
function mergeRecords(values, utils, meta) {
	const result = utils.mergeFunctions.mergeRecords(values, utils, meta);
	if (shouldFallbackToDefault(utils, "mergeRecords", result)) return utils.defaultMergeFunctions.mergeRecords(values, utils, meta);
	return result;
}
/**
* Merge arrays.
*
* @param values - The arrays.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged result.
*/
function mergeArrays(values, utils, meta) {
	const result = utils.mergeFunctions.mergeArrays(values, utils, meta);
	if (shouldFallbackToDefault(utils, "mergeArrays", result)) return utils.defaultMergeFunctions.mergeArrays(values);
	return result;
}
/**
* Merge sets.
*
* @param values - The sets.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged result.
*/
function mergeSets(values, utils, meta) {
	const result = utils.mergeFunctions.mergeSets(values, utils, meta);
	if (shouldFallbackToDefault(utils, "mergeSets", result)) return utils.defaultMergeFunctions.mergeSets(values);
	return result;
}
/**
* Merge maps.
*
* @param values - The maps.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged result.
*/
function mergeMaps(values, utils, meta) {
	const result = utils.mergeFunctions.mergeMaps(values, utils, meta);
	if (shouldFallbackToDefault(utils, "mergeMaps", result)) return utils.defaultMergeFunctions.mergeMaps(values, utils, meta);
	return result;
}
/**
* Merge circular references.
*
* @param values - The circular references.
* @param cyclicDepths - The depth of each circular reference.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged result.
*/
function mergeCircularReferences(values, cyclicDepths, utils, meta) {
	const result = utils.mergeFunctions.mergeCircularReferences(values, cyclicDepths, utils, meta);
	if (shouldFallbackToDefault(utils, "mergeCircularReferences", result)) return utils.defaultMergeFunctions.mergeCircularReferences(values, cyclicDepths, utils, meta);
	return result;
}
/**
* Merge other things.
*
* @param values - The other things.
* @param utils - The utils.
* @param meta - The meta data.
* @returns The merged result.
*/
function mergeOthers(values, utils, meta) {
	const result = utils.mergeFunctions.mergeOthers(values, utils, meta);
	if (shouldFallbackToDefault(utils, "mergeOthers", result)) return utils.defaultMergeFunctions.mergeOthers(values);
	return result;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/html-to-text/lib/html-to-text.mjs
/**
* Make a recursive function that will only run to a given depth
* and switches to an alternative function at that depth. \
* No limitation if `n` is `undefined` (Just wraps `f` in that case).
*
* @param   { number | undefined } n   Allowed depth of recursion. `undefined` for no limitation.
* @param   { Function }           f   Function that accepts recursive callback as the first argument.
* @param   { Function }           [g] Function to run instead, when maximum depth was reached. Do nothing by default.
* @returns { Function }
*/
function limitedDepthRecursive(n, f, g = () => void 0) {
	if (n === void 0) {
		const f1 = function(...args) {
			return f(f1, ...args);
		};
		return f1;
	}
	if (n >= 0) return function(...args) {
		return f(limitedDepthRecursive(n - 1, f, g), ...args);
	};
	return g;
}
/**
* Return the same string or a substring with
* the given character occurrences removed from each side.
*
* @param   { string } str  A string to trim.
* @param   { string } char A character to be trimmed.
* @returns { string }
*/
function trimCharacter(str, char) {
	let start = 0;
	let end = str.length;
	while (start < end && str[start] === char) ++start;
	while (end > start && str[end - 1] === char) --end;
	return start > 0 || end < str.length ? str.substring(start, end) : str;
}
/**
* Return the same string or a substring with
* the given character occurrences removed from the end only.
*
* @param   { string } str  A string to trim.
* @param   { string } char A character to be trimmed.
* @returns { string }
*/
function trimCharacterEnd(str, char) {
	let end = str.length;
	while (end > 0 && str[end - 1] === char) --end;
	return end < str.length ? str.substring(0, end) : str;
}
/**
* Return a new string will all characters replaced with unicode escape sequences.
* This extreme kind of escaping can used to be safely compose regular expressions.
*
* @param { string } str A string to escape.
* @returns { string } A string of unicode escape sequences.
*/
function unicodeEscape(str) {
	return str.replace(/[\s\S]/g, (c) => "\\u" + c.charCodeAt().toString(16).padStart(4, "0"));
}
/**
* Get a nested property from an object.
*
* @param   { object }   obj  The object to query for the value.
* @param   { string[] } path The path to the property.
* @returns { any }
*/
function get(obj, path) {
	for (const key of path) {
		if (!obj) return;
		obj = obj[key];
	}
	return obj;
}
/**
* Convert a number into alphabetic sequence representation (Sequence without zeroes).
*
* For example: `a, ..., z, aa, ..., zz, aaa, ...`.
*
* @param   { number } num         Number to convert. Must be >= 1.
* @param   { string } [baseChar]  Character for 1 in the sequence.
* @param   { number } [base]      Number of characters in the sequence.
* @returns { string }
*/
function numberToLetterSequence(num, baseChar = "a", base = 26) {
	const digits = [];
	do {
		num -= 1;
		digits.push(num % base);
		num = num / base >> 0;
	} while (num > 0);
	const baseCode = baseChar.charCodeAt(0);
	return digits.reverse().map((n) => String.fromCharCode(baseCode + n)).join("");
}
var I = [
	"I",
	"X",
	"C",
	"M"
];
var V = [
	"V",
	"L",
	"D"
];
/**
* Convert a number to it's Roman representation. No large numbers extension.
*
* @param   { number } num Number to convert. `0 < num <= 3999`.
* @returns { string }
*/
function numberToRoman(num) {
	return [...num + ""].map((n) => +n).reverse().map((v, i) => v % 5 < 4 ? (v < 5 ? "" : V[i]) + I[i].repeat(v % 5) : I[i] + (v < 5 ? V[i] : I[i + 1])).reverse().join("");
}
/**
* Helps to build text from words.
*/
var InlineTextBuilder = class {
	/**
	* Creates an instance of InlineTextBuilder.
	*
	* If `maxLineLength` is not provided then it is either `options.wordwrap` or unlimited.
	*
	* @param { Options } options           HtmlToText options.
	* @param { number }  [ maxLineLength ] This builder will try to wrap text to fit this line length.
	*/
	constructor(options, maxLineLength = void 0) {
		/** @type { string[][] } */
		this.lines = [];
		/** @type { string[] }   */
		this.nextLineWords = [];
		this.maxLineLength = maxLineLength || options.wordwrap || Number.MAX_VALUE;
		this.nextLineAvailableChars = this.maxLineLength;
		this.wrapCharacters = get(options, ["longWordSplit", "wrapCharacters"]) || [];
		this.forceWrapOnLimit = get(options, ["longWordSplit", "forceWrapOnLimit"]) || false;
		this.stashedSpace = false;
		this.wordBreakOpportunity = false;
	}
	/**
	* Add a new word.
	*
	* @param { string } word A word to add.
	* @param { boolean } [noWrap] Don't wrap text even if the line is too long.
	*/
	pushWord(word, noWrap = false) {
		if (this.nextLineAvailableChars <= 0 && !noWrap) this.startNewLine();
		const isLineStart = this.nextLineWords.length === 0;
		const cost = word.length + (isLineStart ? 0 : 1);
		if (cost <= this.nextLineAvailableChars || noWrap) {
			this.nextLineWords.push(word);
			this.nextLineAvailableChars -= cost;
		} else {
			const [first, ...rest] = this.splitLongWord(word);
			if (!isLineStart) this.startNewLine();
			this.nextLineWords.push(first);
			this.nextLineAvailableChars -= first.length;
			for (const part of rest) {
				this.startNewLine();
				this.nextLineWords.push(part);
				this.nextLineAvailableChars -= part.length;
			}
		}
	}
	/**
	* Pop a word from the currently built line.
	* This doesn't affect completed lines.
	*
	* @returns { string }
	*/
	popWord() {
		const lastWord = this.nextLineWords.pop();
		if (lastWord !== void 0) {
			const isLineStart = this.nextLineWords.length === 0;
			const cost = lastWord.length + (isLineStart ? 0 : 1);
			this.nextLineAvailableChars += cost;
		}
		return lastWord;
	}
	/**
	* Concat a word to the last word already in the builder.
	* Adds a new word in case there are no words yet in the last line.
	*
	* @param { string } word A word to be concatenated.
	* @param { boolean } [noWrap] Don't wrap text even if the line is too long.
	*/
	concatWord(word, noWrap = false) {
		if (this.wordBreakOpportunity && word.length > this.nextLineAvailableChars) {
			this.pushWord(word, noWrap);
			this.wordBreakOpportunity = false;
		} else {
			const lastWord = this.popWord();
			this.pushWord(lastWord ? lastWord.concat(word) : word, noWrap);
		}
	}
	/**
	* Add current line (and more empty lines if provided argument > 1) to the list of complete lines and start a new one.
	*
	* @param { number } n Number of line breaks that will be added to the resulting string.
	*/
	startNewLine(n = 1) {
		this.lines.push(this.nextLineWords);
		if (n > 1) this.lines.push(...Array.from({ length: n - 1 }, () => []));
		this.nextLineWords = [];
		this.nextLineAvailableChars = this.maxLineLength;
	}
	/**
	* No words in this builder.
	*
	* @returns { boolean }
	*/
	isEmpty() {
		return this.lines.length === 0 && this.nextLineWords.length === 0;
	}
	clear() {
		this.lines.length = 0;
		this.nextLineWords.length = 0;
		this.nextLineAvailableChars = this.maxLineLength;
	}
	/**
	* Join all lines of words inside the InlineTextBuilder into a complete string.
	*
	* @returns { string }
	*/
	toString() {
		return [...this.lines, this.nextLineWords].map((words) => words.join(" ")).join("\n");
	}
	/**
	* Split a long word up to fit within the word wrap limit.
	* Use either a character to split looking back from the word wrap limit,
	* or truncate to the word wrap limit.
	*
	* @param   { string }   word Input word.
	* @returns { string[] }      Parts of the word.
	*/
	splitLongWord(word) {
		const parts = [];
		let idx = 0;
		while (word.length > this.maxLineLength) {
			const firstLine = word.substring(0, this.maxLineLength);
			const remainingChars = word.substring(this.maxLineLength);
			const splitIndex = firstLine.lastIndexOf(this.wrapCharacters[idx]);
			if (splitIndex > -1) {
				word = firstLine.substring(splitIndex + 1) + remainingChars;
				parts.push(firstLine.substring(0, splitIndex + 1));
			} else {
				idx++;
				if (idx < this.wrapCharacters.length) word = firstLine + remainingChars;
				else {
					if (this.forceWrapOnLimit) {
						parts.push(firstLine);
						word = remainingChars;
						if (word.length > this.maxLineLength) continue;
					} else word = firstLine + remainingChars;
					break;
				}
			}
		}
		parts.push(word);
		return parts;
	}
};
var StackItem = class {
	constructor(next = null) {
		this.next = next;
	}
	getRoot() {
		return this.next ? this.next : this;
	}
};
var BlockStackItem = class extends StackItem {
	constructor(options, next = null, leadingLineBreaks = 1, maxLineLength = void 0) {
		super(next);
		this.leadingLineBreaks = leadingLineBreaks;
		this.inlineTextBuilder = new InlineTextBuilder(options, maxLineLength);
		this.rawText = "";
		this.stashedLineBreaks = 0;
		this.isPre = next && next.isPre;
		this.isNoWrap = next && next.isNoWrap;
	}
};
var ListStackItem = class extends BlockStackItem {
	constructor(options, next = null, { interRowLineBreaks = 1, leadingLineBreaks = 2, maxLineLength = void 0, maxPrefixLength = 0, prefixAlign = "left" } = {}) {
		super(options, next, leadingLineBreaks, maxLineLength);
		this.maxPrefixLength = maxPrefixLength;
		this.prefixAlign = prefixAlign;
		this.interRowLineBreaks = interRowLineBreaks;
	}
};
var ListItemStackItem = class extends BlockStackItem {
	constructor(options, next = null, { leadingLineBreaks = 1, maxLineLength = void 0, prefix = "" } = {}) {
		super(options, next, leadingLineBreaks, maxLineLength);
		this.prefix = prefix;
	}
};
var TableStackItem = class extends StackItem {
	constructor(next = null) {
		super(next);
		this.rows = [];
		this.isPre = next && next.isPre;
		this.isNoWrap = next && next.isNoWrap;
	}
};
var TableRowStackItem = class extends StackItem {
	constructor(next = null) {
		super(next);
		this.cells = [];
		this.isPre = next && next.isPre;
		this.isNoWrap = next && next.isNoWrap;
	}
};
var TableCellStackItem = class extends StackItem {
	constructor(options, next = null, maxColumnWidth = void 0) {
		super(next);
		this.inlineTextBuilder = new InlineTextBuilder(options, maxColumnWidth);
		this.rawText = "";
		this.stashedLineBreaks = 0;
		this.isPre = next && next.isPre;
		this.isNoWrap = next && next.isNoWrap;
	}
};
var TransformerStackItem = class extends StackItem {
	constructor(next = null, transform) {
		super(next);
		this.transform = transform;
	}
};
function charactersToCodes(str) {
	return [...str].map((c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")).join("");
}
/**
* Helps to handle HTML whitespaces.
*
* @class WhitespaceProcessor
*/
var WhitespaceProcessor = class {
	/**
	* Creates an instance of WhitespaceProcessor.
	*
	* @param { Options } options    HtmlToText options.
	* @memberof WhitespaceProcessor
	*/
	constructor(options) {
		this.whitespaceChars = options.preserveNewlines ? options.whitespaceCharacters.replace(/\n/g, "") : options.whitespaceCharacters;
		const whitespaceCodes = charactersToCodes(this.whitespaceChars);
		this.leadingWhitespaceRe = new RegExp(`^[${whitespaceCodes}]`);
		this.trailingWhitespaceRe = new RegExp(`[${whitespaceCodes}]$`);
		this.allWhitespaceOrEmptyRe = new RegExp(`^[${whitespaceCodes}]*$`);
		this.newlineOrNonWhitespaceRe = new RegExp(`(\\n|[^\\n${whitespaceCodes}])`, "g");
		this.newlineOrNonNewlineStringRe = new RegExp(`(\\n|[^\\n]+)`, "g");
		if (options.preserveNewlines) {
			const wordOrNewlineRe = new RegExp(`\\n|[^\\n${whitespaceCodes}]+`, "gm");
			/**
			* Shrink whitespaces and wrap text, add to the builder.
			*
			* @param { string }                  text              Input text.
			* @param { InlineTextBuilder }       inlineTextBuilder A builder to receive processed text.
			* @param { (str: string) => string } [ transform ]     A transform to be applied to words.
			* @param { boolean }                 [noWrap] Don't wrap text even if the line is too long.
			*/
			this.shrinkWrapAdd = function(text, inlineTextBuilder, transform = ((str) => str), noWrap = false) {
				if (!text) return;
				const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
				let anyMatch = false;
				let m = wordOrNewlineRe.exec(text);
				if (m) {
					anyMatch = true;
					if (m[0] === "\n") inlineTextBuilder.startNewLine();
					else if (previouslyStashedSpace || this.testLeadingWhitespace(text)) inlineTextBuilder.pushWord(transform(m[0]), noWrap);
					else inlineTextBuilder.concatWord(transform(m[0]), noWrap);
					while ((m = wordOrNewlineRe.exec(text)) !== null) if (m[0] === "\n") inlineTextBuilder.startNewLine();
					else inlineTextBuilder.pushWord(transform(m[0]), noWrap);
				}
				inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch || this.testTrailingWhitespace(text);
			};
		} else {
			const wordRe = new RegExp(`[^${whitespaceCodes}]+`, "g");
			this.shrinkWrapAdd = function(text, inlineTextBuilder, transform = ((str) => str), noWrap = false) {
				if (!text) return;
				const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
				let anyMatch = false;
				let m = wordRe.exec(text);
				if (m) {
					anyMatch = true;
					if (previouslyStashedSpace || this.testLeadingWhitespace(text)) inlineTextBuilder.pushWord(transform(m[0]), noWrap);
					else inlineTextBuilder.concatWord(transform(m[0]), noWrap);
					while ((m = wordRe.exec(text)) !== null) inlineTextBuilder.pushWord(transform(m[0]), noWrap);
				}
				inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch || this.testTrailingWhitespace(text);
			};
		}
	}
	/**
	* Add text with only minimal processing.
	* Everything between newlines considered a single word.
	* No whitespace is trimmed.
	* Not affected by preserveNewlines option - `\n` always starts a new line.
	*
	* `noWrap` argument is `true` by default - this won't start a new line
	* even if there is not enough space left in the current line.
	*
	* @param { string }            text              Input text.
	* @param { InlineTextBuilder } inlineTextBuilder A builder to receive processed text.
	* @param { boolean }           [noWrap] Don't wrap text even if the line is too long.
	*/
	addLiteral(text, inlineTextBuilder, noWrap = true) {
		if (!text) return;
		const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
		let anyMatch = false;
		let m = this.newlineOrNonNewlineStringRe.exec(text);
		if (m) {
			anyMatch = true;
			if (m[0] === "\n") inlineTextBuilder.startNewLine();
			else if (previouslyStashedSpace) inlineTextBuilder.pushWord(m[0], noWrap);
			else inlineTextBuilder.concatWord(m[0], noWrap);
			while ((m = this.newlineOrNonNewlineStringRe.exec(text)) !== null) if (m[0] === "\n") inlineTextBuilder.startNewLine();
			else inlineTextBuilder.pushWord(m[0], noWrap);
		}
		inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch;
	}
	/**
	* Test whether the given text starts with HTML whitespace character.
	*
	* @param   { string }  text  The string to test.
	* @returns { boolean }
	*/
	testLeadingWhitespace(text) {
		return this.leadingWhitespaceRe.test(text);
	}
	/**
	* Test whether the given text ends with HTML whitespace character.
	*
	* @param   { string }  text  The string to test.
	* @returns { boolean }
	*/
	testTrailingWhitespace(text) {
		return this.trailingWhitespaceRe.test(text);
	}
	/**
	* Test whether the given text contains any non-whitespace characters.
	*
	* @param   { string }  text  The string to test.
	* @returns { boolean }
	*/
	testContainsWords(text) {
		return !this.allWhitespaceOrEmptyRe.test(text);
	}
	/**
	* Return the number of newlines if there are no words.
	*
	* If any word is found then return zero regardless of the actual number of newlines.
	*
	* @param   { string }  text  Input string.
	* @returns { number }
	*/
	countNewlinesNoWords(text) {
		this.newlineOrNonWhitespaceRe.lastIndex = 0;
		let counter = 0;
		let match;
		while ((match = this.newlineOrNonWhitespaceRe.exec(text)) !== null) if (match[0] === "\n") counter++;
		else return 0;
		return counter;
	}
};
/**
* Helps to build text from inline and block elements.
*
* @class BlockTextBuilder
*/
var BlockTextBuilder = class {
	/**
	* Creates an instance of BlockTextBuilder.
	*
	* @param { Options } options HtmlToText options.
	* @param { import('selderee').Picker<DomNode, TagDefinition> } picker Selectors decision tree picker.
	* @param { any} [metadata] Optional metadata for HTML document, for use in formatters.
	*/
	constructor(options, picker, metadata = void 0) {
		this.options = options;
		this.picker = picker;
		this.metadata = metadata;
		this.whitespaceProcessor = new WhitespaceProcessor(options);
		/** @type { StackItem } */
		this._stackItem = new BlockStackItem(options);
		/** @type { TransformerStackItem } */
		this._wordTransformer = void 0;
	}
	/**
	* Put a word-by-word transform function onto the transformations stack.
	*
	* Mainly used for uppercasing. Can be bypassed to add unformatted text such as URLs.
	*
	* Word transformations applied before wrapping.
	*
	* @param { (str: string) => string } wordTransform Word transformation function.
	*/
	pushWordTransform(wordTransform) {
		this._wordTransformer = new TransformerStackItem(this._wordTransformer, wordTransform);
	}
	/**
	* Remove a function from the word transformations stack.
	*
	* @returns { (str: string) => string } A function that was removed.
	*/
	popWordTransform() {
		if (!this._wordTransformer) return;
		const transform = this._wordTransformer.transform;
		this._wordTransformer = this._wordTransformer.next;
		return transform;
	}
	/**
	* Ignore wordwrap option in followup inline additions and disable automatic wrapping.
	*/
	startNoWrap() {
		this._stackItem.isNoWrap = true;
	}
	/**
	* Return automatic wrapping to behavior defined by options.
	*/
	stopNoWrap() {
		this._stackItem.isNoWrap = false;
	}
	/** @returns { (str: string) => string } */
	_getCombinedWordTransformer() {
		const wt = this._wordTransformer ? ((str) => applyTransformer(str, this._wordTransformer)) : void 0;
		const ce = this.options.encodeCharacters;
		return wt ? ce ? (str) => ce(wt(str)) : wt : ce;
	}
	_popStackItem() {
		const item = this._stackItem;
		this._stackItem = item.next;
		return item;
	}
	/**
	* Add a line break into currently built block.
	*/
	addLineBreak() {
		if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) return;
		if (this._stackItem.isPre) this._stackItem.rawText += "\n";
		else this._stackItem.inlineTextBuilder.startNewLine();
	}
	/**
	* Allow to break line in case directly following text will not fit.
	*/
	addWordBreakOpportunity() {
		if (this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem) this._stackItem.inlineTextBuilder.wordBreakOpportunity = true;
	}
	/**
	* Add a node inline into the currently built block.
	*
	* @param { string } str
	* Text content of a node to add.
	*
	* @param { object } [param1]
	* Object holding the parameters of the operation.
	*
	* @param { boolean } [param1.noWordTransform]
	* Ignore word transformers if there are any.
	* Don't encode characters as well.
	* (Use this for things like URL addresses).
	*/
	addInline(str, { noWordTransform = false } = {}) {
		if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) return;
		if (this._stackItem.isPre) {
			this._stackItem.rawText += str;
			return;
		}
		if (str.length === 0 || this._stackItem.stashedLineBreaks && !this.whitespaceProcessor.testContainsWords(str)) return;
		if (this.options.preserveNewlines) {
			const newlinesNumber = this.whitespaceProcessor.countNewlinesNoWords(str);
			if (newlinesNumber > 0) {
				this._stackItem.inlineTextBuilder.startNewLine(newlinesNumber);
				return;
			}
		}
		if (this._stackItem.stashedLineBreaks) this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks);
		this.whitespaceProcessor.shrinkWrapAdd(str, this._stackItem.inlineTextBuilder, noWordTransform ? void 0 : this._getCombinedWordTransformer(), this._stackItem.isNoWrap);
		this._stackItem.stashedLineBreaks = 0;
	}
	/**
	* Add a string inline into the currently built block.
	*
	* Use this for markup elements that don't have to adhere
	* to text layout rules.
	*
	* @param { string } str Text to add.
	*/
	addLiteral(str) {
		if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) return;
		if (str.length === 0) return;
		if (this._stackItem.isPre) {
			this._stackItem.rawText += str;
			return;
		}
		if (this._stackItem.stashedLineBreaks) this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks);
		this.whitespaceProcessor.addLiteral(str, this._stackItem.inlineTextBuilder, this._stackItem.isNoWrap);
		this._stackItem.stashedLineBreaks = 0;
	}
	/**
	* Start building a new block.
	*
	* @param { object } [param0]
	* Object holding the parameters of the block.
	*
	* @param { number } [param0.leadingLineBreaks]
	* This block should have at least this number of line breaks to separate it from any preceding block.
	*
	* @param { number }  [param0.reservedLineLength]
	* Reserve this number of characters on each line for block markup.
	*
	* @param { boolean } [param0.isPre]
	* Should HTML whitespace be preserved inside this block.
	*/
	openBlock({ leadingLineBreaks = 1, reservedLineLength = 0, isPre = false } = {}) {
		const maxLineLength = Math.max(20, this._stackItem.inlineTextBuilder.maxLineLength - reservedLineLength);
		this._stackItem = new BlockStackItem(this.options, this._stackItem, leadingLineBreaks, maxLineLength);
		if (isPre) this._stackItem.isPre = true;
	}
	/**
	* Finalize currently built block, add it's content to the parent block.
	*
	* @param { object } [param0]
	* Object holding the parameters of the block.
	*
	* @param { number } [param0.trailingLineBreaks]
	* This block should have at least this number of line breaks to separate it from any following block.
	*
	* @param { (str: string) => string } [param0.blockTransform]
	* A function to transform the block text before adding to the parent block.
	* This happens after word wrap and should be used in combination with reserved line length
	* in order to keep line lengths correct.
	* Used for whole block markup.
	*/
	closeBlock({ trailingLineBreaks = 1, blockTransform = void 0 } = {}) {
		const block = this._popStackItem();
		const blockText = blockTransform ? blockTransform(getText(block)) : getText(block);
		addText(this._stackItem, blockText, block.leadingLineBreaks, Math.max(block.stashedLineBreaks, trailingLineBreaks));
	}
	/**
	* Start building a new list.
	*
	* @param { object } [param0]
	* Object holding the parameters of the list.
	*
	* @param { number } [param0.maxPrefixLength]
	* Length of the longest list item prefix.
	* If not supplied or too small then list items won't be aligned properly.
	*
	* @param { 'left' | 'right' } [param0.prefixAlign]
	* Specify how prefixes of different lengths have to be aligned
	* within a column.
	*
	* @param { number } [param0.interRowLineBreaks]
	* Minimum number of line breaks between list items.
	*
	* @param { number } [param0.leadingLineBreaks]
	* This list should have at least this number of line breaks to separate it from any preceding block.
	*/
	openList({ maxPrefixLength = 0, prefixAlign = "left", interRowLineBreaks = 1, leadingLineBreaks = 2 } = {}) {
		this._stackItem = new ListStackItem(this.options, this._stackItem, {
			interRowLineBreaks,
			leadingLineBreaks,
			maxLineLength: this._stackItem.inlineTextBuilder.maxLineLength,
			maxPrefixLength,
			prefixAlign
		});
	}
	/**
	* Start building a new list item.
	*
	* @param {object} param0
	* Object holding the parameters of the list item.
	*
	* @param { string } [param0.prefix]
	* Prefix for this list item (item number, bullet point, etc).
	*/
	openListItem({ prefix = "" } = {}) {
		if (!(this._stackItem instanceof ListStackItem)) throw new Error("Can't add a list item to something that is not a list! Check the formatter.");
		const list = this._stackItem;
		const prefixLength = Math.max(prefix.length, list.maxPrefixLength);
		const maxLineLength = Math.max(20, list.inlineTextBuilder.maxLineLength - prefixLength);
		this._stackItem = new ListItemStackItem(this.options, list, {
			prefix,
			maxLineLength,
			leadingLineBreaks: list.interRowLineBreaks
		});
	}
	/**
	* Finalize currently built list item, add it's content to the parent list.
	*/
	closeListItem() {
		const listItem = this._popStackItem();
		const list = listItem.next;
		const prefixLength = Math.max(listItem.prefix.length, list.maxPrefixLength);
		const spacing = "\n" + " ".repeat(prefixLength);
		addText(list, (list.prefixAlign === "right" ? listItem.prefix.padStart(prefixLength) : listItem.prefix.padEnd(prefixLength)) + getText(listItem).replace(/\n/g, spacing), listItem.leadingLineBreaks, Math.max(listItem.stashedLineBreaks, list.interRowLineBreaks));
	}
	/**
	* Finalize currently built list, add it's content to the parent block.
	*
	* @param { object } param0
	* Object holding the parameters of the list.
	*
	* @param { number } [param0.trailingLineBreaks]
	* This list should have at least this number of line breaks to separate it from any following block.
	*/
	closeList({ trailingLineBreaks = 2 } = {}) {
		const list = this._popStackItem();
		const text = getText(list);
		if (text) addText(this._stackItem, text, list.leadingLineBreaks, trailingLineBreaks);
	}
	/**
	* Start building a table.
	*/
	openTable() {
		this._stackItem = new TableStackItem(this._stackItem);
	}
	/**
	* Start building a table row.
	*/
	openTableRow() {
		if (!(this._stackItem instanceof TableStackItem)) throw new Error("Can't add a table row to something that is not a table! Check the formatter.");
		this._stackItem = new TableRowStackItem(this._stackItem);
	}
	/**
	* Start building a table cell.
	*
	* @param { object } [param0]
	* Object holding the parameters of the cell.
	*
	* @param { number } [param0.maxColumnWidth]
	* Wrap cell content to this width. Fall back to global wordwrap value if undefined.
	*/
	openTableCell({ maxColumnWidth = void 0 } = {}) {
		if (!(this._stackItem instanceof TableRowStackItem)) throw new Error("Can't add a table cell to something that is not a table row! Check the formatter.");
		this._stackItem = new TableCellStackItem(this.options, this._stackItem, maxColumnWidth);
	}
	/**
	* Finalize currently built table cell and add it to parent table row's cells.
	*
	* @param { object } [param0]
	* Object holding the parameters of the cell.
	*
	* @param { number } [param0.colspan] How many columns this cell should occupy.
	* @param { number } [param0.rowspan] How many rows this cell should occupy.
	*/
	closeTableCell({ colspan = 1, rowspan = 1 } = {}) {
		const cell = this._popStackItem();
		const text = trimCharacter(getText(cell), "\n");
		cell.next.cells.push({
			colspan,
			rowspan,
			text
		});
	}
	/**
	* Finalize currently built table row and add it to parent table's rows.
	*/
	closeTableRow() {
		const row = this._popStackItem();
		row.next.rows.push(row.cells);
	}
	/**
	* Finalize currently built table and add the rendered text to the parent block.
	*
	* @param { object } param0
	* Object holding the parameters of the table.
	*
	* @param { TablePrinter } param0.tableToString
	* A function to convert a table of stringified cells into a complete table.
	*
	* @param { number } [param0.leadingLineBreaks]
	* This table should have at least this number of line breaks to separate if from any preceding block.
	*
	* @param { number } [param0.trailingLineBreaks]
	* This table should have at least this number of line breaks to separate it from any following block.
	*/
	closeTable({ tableToString, leadingLineBreaks = 2, trailingLineBreaks = 2 }) {
		const output = tableToString(this._popStackItem().rows);
		if (output) addText(this._stackItem, output, leadingLineBreaks, trailingLineBreaks);
	}
	/**
	* Return the rendered text content of this builder.
	*
	* @returns { string }
	*/
	toString() {
		return getText(this._stackItem.getRoot());
	}
};
function getText(stackItem) {
	if (!(stackItem instanceof BlockStackItem || stackItem instanceof ListItemStackItem || stackItem instanceof TableCellStackItem)) throw new Error("Only blocks, list items and table cells can be requested for text contents.");
	return stackItem.inlineTextBuilder.isEmpty() ? stackItem.rawText : stackItem.rawText + stackItem.inlineTextBuilder.toString();
}
function addText(stackItem, text, leadingLineBreaks, trailingLineBreaks) {
	if (!(stackItem instanceof BlockStackItem || stackItem instanceof ListItemStackItem || stackItem instanceof TableCellStackItem)) throw new Error("Only blocks, list items and table cells can contain text.");
	const parentText = getText(stackItem);
	const lineBreaks = Math.max(stackItem.stashedLineBreaks, leadingLineBreaks);
	stackItem.inlineTextBuilder.clear();
	if (parentText) stackItem.rawText = parentText + "\n".repeat(lineBreaks) + text;
	else {
		stackItem.rawText = text;
		stackItem.leadingLineBreaks = lineBreaks;
	}
	stackItem.stashedLineBreaks = trailingLineBreaks;
}
/**
* @param { string } str A string to transform.
* @param { TransformerStackItem } transformer A transformer item (with possible continuation).
* @returns { string }
*/
function applyTransformer(str, transformer) {
	return transformer ? applyTransformer(transformer.transform(str), transformer.next) : str;
}
/**
* Compile selectors into a decision tree,
* return a function intended for batch processing.
*
* @param   { Options } [options]   HtmlToText options (defaults, formatters, user options merged, deduplicated).
* @returns { (html: string, metadata?: any) => string } Pre-configured converter function.
* @static
*/
function compile$1(options = {}) {
	const selectorsWithoutFormat = options.selectors.filter((s) => !s.format);
	if (selectorsWithoutFormat.length) throw new Error("Following selectors have no specified format: " + selectorsWithoutFormat.map((s) => `\`${s.selector}\``).join(", "));
	const picker = new DecisionTree(options.selectors.map((s) => [s.selector, s])).build(hp2Builder);
	if (typeof options.encodeCharacters !== "function") options.encodeCharacters = makeReplacerFromDict(options.encodeCharacters);
	const baseSelectorsPicker = new DecisionTree(options.baseElements.selectors.map((s, i) => [s, i + 1])).build(hp2Builder);
	function findBaseElements(dom) {
		return findBases(dom, options, baseSelectorsPicker);
	}
	const limitedWalk = limitedDepthRecursive(options.limits.maxDepth, recursiveWalk, function(dom, builder) {
		builder.addInline(options.limits.ellipsis || "");
	});
	return function(html, metadata = void 0) {
		return process(html, metadata, options, picker, findBaseElements, limitedWalk);
	};
}
/**
* Convert given HTML according to preprocessed options.
*
* @param { string } html HTML content to convert.
* @param { any } metadata Optional metadata for HTML document, for use in formatters.
* @param { Options } options HtmlToText options (preprocessed).
* @param { import('selderee').Picker<DomNode, TagDefinition> } picker
* Tag definition picker for DOM nodes processing.
* @param { (dom: DomNode[]) => DomNode[] } findBaseElements
* Function to extract elements from HTML DOM
* that will only be present in the output text.
* @param { RecursiveCallback } walk Recursive callback.
* @returns { string }
*/
function process(html, metadata, options, picker, findBaseElements, walk) {
	const maxInputLength = options.limits.maxInputLength;
	if (maxInputLength && html && html.length > maxInputLength) {
		console.warn(`Input length ${html.length} is above allowed limit of ${maxInputLength}. Truncating without ellipsis.`);
		html = html.substring(0, maxInputLength);
	}
	const bases = findBaseElements(parseDocument(html, { decodeEntities: options.decodeEntities }).children);
	const builder = new BlockTextBuilder(options, picker, metadata);
	walk(bases, builder);
	return builder.toString();
}
function findBases(dom, options, baseSelectorsPicker) {
	const results = [];
	function recursiveWalk(walk, dom) {
		dom = dom.slice(0, options.limits.maxChildNodes);
		for (const elem of dom) {
			if (elem.type !== "tag") continue;
			const pickedSelectorIndex = baseSelectorsPicker.pick1(elem);
			if (pickedSelectorIndex > 0) results.push({
				selectorIndex: pickedSelectorIndex,
				element: elem
			});
			else if (elem.children) walk(elem.children);
			if (results.length >= options.limits.maxBaseElements) return;
		}
	}
	limitedDepthRecursive(options.limits.maxDepth, recursiveWalk)(dom);
	if (options.baseElements.orderBy !== "occurrence") results.sort((a, b) => a.selectorIndex - b.selectorIndex);
	return options.baseElements.returnDomByDefault && results.length === 0 ? dom : results.map((x) => x.element);
}
/**
* Function to walk through DOM nodes and accumulate their string representations.
*
* @param   { RecursiveCallback } walk    Recursive callback.
* @param   { DomNode[] }         [dom]   Nodes array to process.
* @param   { BlockTextBuilder }  builder Passed around to accumulate output text.
* @private
*/
function recursiveWalk(walk, dom, builder) {
	if (!dom) return;
	const options = builder.options;
	if (dom.length > options.limits.maxChildNodes) {
		dom = dom.slice(0, options.limits.maxChildNodes);
		dom.push({
			data: options.limits.ellipsis,
			type: "text"
		});
	}
	for (const elem of dom) switch (elem.type) {
		case "text":
			builder.addInline(elem.data);
			break;
		case "tag": {
			const tagDefinition = builder.picker.pick1(elem);
			const format = options.formatters[tagDefinition.format];
			format(elem, walk, builder, tagDefinition.options || {});
			break;
		}
	}
}
/**
* @param { {[key: string]: string | false} } dict
* A dictionary where keys are characters to replace
* and values are replacement strings.
*
* First code point from dict keys is used.
* Compound emojis with ZWJ are not supported (not until Node 16).
*
* @returns { ((str: string) => string) | undefined }
*/
function makeReplacerFromDict(dict) {
	if (!dict || Object.keys(dict).length === 0) return;
	/** @type { [string, string][] } */
	const entries = Object.entries(dict).filter(([, v]) => v !== false);
	const regex = new RegExp(entries.map(([c]) => `(${unicodeEscape([...c][0])})`).join("|"), "g");
	const values = entries.map(([, v]) => v);
	const replacer = (m, ...cgs) => values[cgs.findIndex((cg) => cg)];
	return (str) => str.replace(regex, replacer);
}
/**
* Dummy formatter that discards the input and does nothing.
*
* @type { FormatCallback }
*/
function formatSkip(elem, walk, builder, formatOptions) {}
/**
* Insert the given string literal inline instead of a tag.
*
* @type { FormatCallback }
*/
function formatInlineString(elem, walk, builder, formatOptions) {
	builder.addLiteral(formatOptions.string || "");
}
/**
* Insert a block with the given string literal instead of a tag.
*
* @type { FormatCallback }
*/
function formatBlockString(elem, walk, builder, formatOptions) {
	builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
	builder.addLiteral(formatOptions.string || "");
	builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
/**
* Process an inline-level element.
*
* @type { FormatCallback }
*/
function formatInline(elem, walk, builder, formatOptions) {
	walk(elem.children, builder);
}
/**
* Process a block-level container.
*
* @type { FormatCallback }
*/
function formatBlock$1(elem, walk, builder, formatOptions) {
	builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
	walk(elem.children, builder);
	builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
function renderOpenTag(elem) {
	const attrs = elem.attribs && elem.attribs.length ? " " + Object.entries(elem.attribs).map(([k, v]) => v === "" ? k : `${k}=${v.replace(/"/g, "&quot;")}`).join(" ") : "";
	return `<${elem.name}${attrs}>`;
}
function renderCloseTag(elem) {
	return `</${elem.name}>`;
}
/**
* Render an element as inline HTML tag, walk through it's children.
*
* @type { FormatCallback }
*/
function formatInlineTag(elem, walk, builder, formatOptions) {
	builder.startNoWrap();
	builder.addLiteral(renderOpenTag(elem));
	builder.stopNoWrap();
	walk(elem.children, builder);
	builder.startNoWrap();
	builder.addLiteral(renderCloseTag(elem));
	builder.stopNoWrap();
}
/**
* Render an element as HTML block bag, walk through it's children.
*
* @type { FormatCallback }
*/
function formatBlockTag(elem, walk, builder, formatOptions) {
	builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
	builder.startNoWrap();
	builder.addLiteral(renderOpenTag(elem));
	builder.stopNoWrap();
	walk(elem.children, builder);
	builder.startNoWrap();
	builder.addLiteral(renderCloseTag(elem));
	builder.stopNoWrap();
	builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
/**
* Render an element with all it's children as inline HTML.
*
* @type { FormatCallback }
*/
function formatInlineHtml(elem, walk, builder, formatOptions) {
	builder.startNoWrap();
	builder.addLiteral(render$1(elem, { decodeEntities: builder.options.decodeEntities }));
	builder.stopNoWrap();
}
/**
* Render an element with all it's children as HTML block.
*
* @type { FormatCallback }
*/
function formatBlockHtml(elem, walk, builder, formatOptions) {
	builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
	builder.startNoWrap();
	builder.addLiteral(render$1(elem, { decodeEntities: builder.options.decodeEntities }));
	builder.stopNoWrap();
	builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
/**
* Render inline element wrapped with given strings.
*
* @type { FormatCallback }
*/
function formatInlineSurround(elem, walk, builder, formatOptions) {
	builder.addLiteral(formatOptions.prefix || "");
	walk(elem.children, builder);
	builder.addLiteral(formatOptions.suffix || "");
}
var genericFormatters = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	block: formatBlock$1,
	blockHtml: formatBlockHtml,
	blockString: formatBlockString,
	blockTag: formatBlockTag,
	inline: formatInline,
	inlineHtml: formatInlineHtml,
	inlineString: formatInlineString,
	inlineSurround: formatInlineSurround,
	inlineTag: formatInlineTag,
	skip: formatSkip
});
var mergeArraysOverwrite = (values) => {
	const lastValue = values[values.length - 1];
	return Array.isArray(lastValue) ? [...lastValue] : [];
};
var deepMergeWithOverwriteArrays = deepmergeCustom({
	filterValues: false,
	mergeArrays: mergeArraysOverwrite
});
var deepMergeWithOptionsComposeRules = deepmergeCustom({
	filterValues: false,
	mergeArrays: (values, utils, meta) => {
		const keyPath = meta?.keyPath ? meta.keyPath : [];
		return keyPath.length === 1 && keyPath[0] === "selectors" ? values.flatMap((value) => value) : mergeArraysOverwrite(values);
	},
	metaDataUpdater: (previousMeta, metaMeta) => {
		if (previousMeta === void 0) return metaMeta.key === void 0 ? { keyPath: [] } : { keyPath: [metaMeta.key] };
		if (metaMeta.key === void 0) return previousMeta;
		return { keyPath: [...previousMeta.keyPath, metaMeta.key] };
	}
});
/**
* Deduplicate an array by a given key callback.
* Item properties are merged recursively and with the preference for last defined values.
* Of items with the same key, merged item takes the place of the last item,
* others are omitted.
*
* @param { any[] } items An array to deduplicate.
* @param { (x: any) => string } getKey Callback to get a value that distinguishes unique items.
* @returns { any[] }
*/
function mergeDuplicatesPreferLast(items, getKey) {
	const map = /* @__PURE__ */ new Map();
	for (let i = items.length; i-- > 0;) {
		const item = items[i];
		const key = getKey(item);
		map.set(key, map.has(key) ? deepMergeWithOverwriteArrays(item, map.get(key)) : item);
	}
	return [...map.values()].reverse();
}
/**
* Merge default and user options, merge formatters and deduplicate selectors.
*
* @param { object } params Options preprocessing parameters.
* @param { Options } params.defaultOptions Package default options.
* @param { Options } [params.userOptions] User-provided options.
* @param { object } params.genericFormatters Generic formatters.
* @param { object } params.packageFormatters Package-specific formatters.
* @param { (options: Options) => void } [params.handleMergedOptions]
* Hook to mutate merged options after formatter/selector preprocessing.
* @returns { Options }
*/
function composeOptions({ defaultOptions, userOptions = {}, genericFormatters, packageFormatters, handleMergedOptions }) {
	const options = deepMergeWithOptionsComposeRules(defaultOptions, userOptions);
	options.formatters = Object.assign({}, genericFormatters, packageFormatters, options.formatters);
	options.selectors = mergeDuplicatesPreferLast(options.selectors, ((s) => s.selector));
	if (handleMergedOptions) handleMergedOptions(options);
	return options;
}
function getRow(matrix, j) {
	if (!matrix[j]) matrix[j] = [];
	return matrix[j];
}
function findFirstVacantIndex(row, x = 0) {
	while (row[x]) x++;
	return x;
}
function transposeInPlace(matrix, maxSize) {
	for (let i = 0; i < maxSize; i++) {
		const rowI = getRow(matrix, i);
		for (let j = 0; j < i; j++) {
			const rowJ = getRow(matrix, j);
			if (rowI[j] || rowJ[i]) {
				const temp = rowI[j];
				rowI[j] = rowJ[i];
				rowJ[i] = temp;
			}
		}
	}
}
function putCellIntoLayout(cell, layout, baseRow, baseCol) {
	for (let r = 0; r < cell.rowspan; r++) {
		const layoutRow = getRow(layout, baseRow + r);
		for (let c = 0; c < cell.colspan; c++) layoutRow[baseCol + c] = cell;
	}
}
function getOrInitOffset(offsets, index) {
	if (offsets[index] === void 0) offsets[index] = index === 0 ? 0 : 1 + getOrInitOffset(offsets, index - 1);
	return offsets[index];
}
function updateOffset(offsets, base, span, value) {
	offsets[base + span] = Math.max(getOrInitOffset(offsets, base + span), getOrInitOffset(offsets, base) + value);
}
/**
* Render a table into a string.
* Cells can contain multiline text and span across multiple rows and columns.
*
* Modifies cells to add lines array.
*
* @param { TablePrinterCell[][] } tableRows Table to render.
* @param { number } rowSpacing Number of spaces between columns.
* @param { number } colSpacing Number of empty lines between rows.
* @returns { string }
*/
function tableToString(tableRows, rowSpacing, colSpacing) {
	const layout = [];
	let colNumber = 0;
	const rowNumber = tableRows.length;
	const rowOffsets = [0];
	for (let j = 0; j < rowNumber; j++) {
		const layoutRow = getRow(layout, j);
		const cells = tableRows[j];
		let x = 0;
		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];
			x = findFirstVacantIndex(layoutRow, x);
			putCellIntoLayout(cell, layout, j, x);
			x += cell.colspan;
			cell.lines = cell.text.split("\n");
			const cellHeight = cell.lines.length;
			updateOffset(rowOffsets, j, cell.rowspan, cellHeight + rowSpacing);
		}
		colNumber = layoutRow.length > colNumber ? layoutRow.length : colNumber;
	}
	transposeInPlace(layout, rowNumber > colNumber ? rowNumber : colNumber);
	const outputLines = [];
	const colOffsets = [0];
	for (let x = 0; x < colNumber; x++) {
		let y = 0;
		let cell;
		const rowsInThisColumn = Math.min(rowNumber, layout[x].length);
		while (y < rowsInThisColumn) {
			cell = layout[x][y];
			if (cell) {
				if (!cell.rendered) {
					let cellWidth = 0;
					for (let j = 0; j < cell.lines.length; j++) {
						const line = cell.lines[j];
						const lineOffset = rowOffsets[y] + j;
						outputLines[lineOffset] = (outputLines[lineOffset] || "").padEnd(colOffsets[x]) + line;
						cellWidth = line.length > cellWidth ? line.length : cellWidth;
					}
					updateOffset(colOffsets, x, cell.colspan, cellWidth + colSpacing);
					cell.rendered = true;
				}
				y += cell.rowspan;
			} else {
				const lineOffset = rowOffsets[y];
				outputLines[lineOffset] = outputLines[lineOffset] || "";
				y++;
			}
		}
	}
	return outputLines.join("\n");
}
/**
* Process a line-break.
*
* @type { FormatCallback }
*/
function formatLineBreak(elem, walk, builder, formatOptions) {
	builder.addLineBreak();
}
/**
* Process a `wbr` tag (word break opportunity).
*
* @type { FormatCallback }
*/
function formatWbr(elem, walk, builder, formatOptions) {
	builder.addWordBreakOpportunity();
}
/**
* Process a horizontal line.
*
* @type { FormatCallback }
*/
function formatHorizontalLine(elem, walk, builder, formatOptions) {
	builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
	builder.addInline("-".repeat(formatOptions.length || builder.options.wordwrap || 40));
	builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
/**
* Process a paragraph.
*
* @type { FormatCallback }
*/
function formatParagraph(elem, walk, builder, formatOptions) {
	builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
	walk(elem.children, builder);
	builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
/**
* Process a preformatted content.
*
* @type { FormatCallback }
*/
function formatPre(elem, walk, builder, formatOptions) {
	builder.openBlock({
		isPre: true,
		leadingLineBreaks: formatOptions.leadingLineBreaks || 2
	});
	walk(elem.children, builder);
	builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
/**
* Process a heading.
*
* @type { FormatCallback }
*/
function formatHeading(elem, walk, builder, formatOptions) {
	builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
	if (formatOptions.uppercase !== false) {
		builder.pushWordTransform((str) => str.toUpperCase());
		walk(elem.children, builder);
		builder.popWordTransform();
	} else walk(elem.children, builder);
	builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
/**
* Process a blockquote.
*
* @type { FormatCallback }
*/
function formatBlockquote(elem, walk, builder, formatOptions) {
	builder.openBlock({
		leadingLineBreaks: formatOptions.leadingLineBreaks || 2,
		reservedLineLength: 2
	});
	walk(elem.children, builder);
	builder.closeBlock({
		trailingLineBreaks: formatOptions.trailingLineBreaks || 2,
		blockTransform: (str) => (formatOptions.trimEmptyLines !== false ? trimCharacter(str, "\n") : str).split("\n").map((line) => "> " + line).join("\n")
	});
}
function withBrackets(str, brackets) {
	if (!brackets) return str;
	const lbr = typeof brackets[0] === "string" ? brackets[0] : "[";
	const rbr = typeof brackets[1] === "string" ? brackets[1] : "]";
	return lbr + str + rbr;
}
function pathRewrite(path, rewriter, baseUrl, metadata, elem) {
	const modifiedPath = typeof rewriter === "function" ? rewriter(path, metadata, elem) : path;
	return modifiedPath[0] === "/" && baseUrl ? trimCharacterEnd(baseUrl, "/") + modifiedPath : modifiedPath;
}
/**
* Process an image.
*
* @type { FormatCallback }
*/
function formatImage(elem, walk, builder, formatOptions) {
	const attribs = elem.attribs || {};
	const alt = attribs.alt ? attribs.alt : "";
	const src = !attribs.src ? "" : pathRewrite(attribs.src, formatOptions.pathRewrite, formatOptions.baseUrl, builder.metadata, elem);
	const text = !src ? alt : !alt ? withBrackets(src, formatOptions.linkBrackets) : alt + " " + withBrackets(src, formatOptions.linkBrackets);
	builder.addInline(text, { noWordTransform: true });
}
/**
* Process an anchor.
*
* @type { FormatCallback }
*/
function formatAnchor(elem, walk, builder, formatOptions) {
	function getHref() {
		if (formatOptions.ignoreHref) return "";
		if (!elem.attribs || !elem.attribs.href) return "";
		let href = elem.attribs.href.replace(/^mailto:/, "");
		if (formatOptions.noAnchorUrl && href[0] === "#") return "";
		href = pathRewrite(href, formatOptions.pathRewrite, formatOptions.baseUrl, builder.metadata, elem);
		return href;
	}
	const href = getHref();
	if (!href) walk(elem.children, builder);
	else {
		let text = "";
		builder.pushWordTransform((str) => {
			if (str) text += str;
			return str;
		});
		walk(elem.children, builder);
		builder.popWordTransform();
		if (!(formatOptions.hideLinkHrefIfSameAsText && href === text)) builder.addInline(!text ? href : " " + withBrackets(href, formatOptions.linkBrackets), { noWordTransform: true });
	}
}
/**
* @param { DomNode }           elem               List items with their prefixes.
* @param { RecursiveCallback } walk               Recursive callback to process child nodes.
* @param { BlockTextBuilder }  builder            Passed around to accumulate output text.
* @param { FormatOptions }     formatOptions      Options specific to a formatter.
* @param { () => string }      nextPrefixCallback Function that returns increasing index each time it is called.
*/
function formatList(elem, walk, builder, formatOptions, nextPrefixCallback) {
	const isNestedList = get(elem, ["parent", "name"]) === "li";
	let maxPrefixLength = 0;
	const listItems = (elem.children || []).filter((child) => child.type !== "text" || !/^\s*$/.test(child.data)).map(function(child) {
		if (child.name !== "li") return {
			node: child,
			prefix: ""
		};
		const prefix = isNestedList ? nextPrefixCallback().trimStart() : nextPrefixCallback();
		if (prefix.length > maxPrefixLength) maxPrefixLength = prefix.length;
		return {
			node: child,
			prefix
		};
	});
	if (!listItems.length) return;
	builder.openList({
		interRowLineBreaks: 1,
		leadingLineBreaks: isNestedList ? 1 : formatOptions.leadingLineBreaks || 2,
		maxPrefixLength,
		prefixAlign: "left"
	});
	for (const { node, prefix } of listItems) {
		builder.openListItem({ prefix });
		walk([node], builder);
		builder.closeListItem();
	}
	builder.closeList({ trailingLineBreaks: isNestedList ? 1 : formatOptions.trailingLineBreaks || 2 });
}
/**
* Process an unordered list.
*
* @type { FormatCallback }
*/
function formatUnorderedList(elem, walk, builder, formatOptions) {
	const prefix = formatOptions.itemPrefix || " * ";
	return formatList(elem, walk, builder, formatOptions, () => prefix);
}
/**
* Process an ordered list.
*
* @type { FormatCallback }
*/
function formatOrderedList(elem, walk, builder, formatOptions) {
	let nextIndex = Number(elem.attribs.start || "1");
	const indexFunction = getOrderedListIndexFunction(elem.attribs.type);
	const nextPrefixCallback = () => " " + indexFunction(nextIndex++) + ". ";
	return formatList(elem, walk, builder, formatOptions, nextPrefixCallback);
}
/**
* Return a function that can be used to generate index markers of a specified format.
*
* @param   { string } [olType] Marker type.
* @returns { (i: number) => string }
*/
function getOrderedListIndexFunction(olType = "1") {
	switch (olType) {
		case "a": return (i) => numberToLetterSequence(i, "a");
		case "A": return (i) => numberToLetterSequence(i, "A");
		case "i": return (i) => numberToRoman(i).toLowerCase();
		case "I": return (i) => numberToRoman(i);
		default: return (i) => i.toString();
	}
}
/**
* Given a list of class and ID selectors (prefixed with '.' and '#'),
* return them as separate lists of names without prefixes.
*
* @param { string[] } selectors Class and ID selectors (`[".class", "#id"]` etc).
* @returns { { classes: string[], ids: string[] } }
*/
function splitClassesAndIds(selectors) {
	const classes = [];
	const ids = [];
	for (const selector of selectors) if (selector.startsWith(".")) classes.push(selector.substring(1));
	else if (selector.startsWith("#")) ids.push(selector.substring(1));
	return {
		classes,
		ids
	};
}
function isDataTable(attr, tables) {
	if (tables === true) return true;
	if (!attr) return false;
	const { classes, ids } = splitClassesAndIds(tables);
	const attrClasses = (attr["class"] || "").split(" ");
	const attrIds = (attr["id"] || "").split(" ");
	return attrClasses.some((x) => classes.includes(x)) || attrIds.some((x) => ids.includes(x));
}
/**
* Process a table (either as a container or as a data table, depending on options).
*
* @type { FormatCallback }
*/
function formatTable(elem, walk, builder, formatOptions) {
	return isDataTable(elem.attribs, builder.options.tables) ? formatDataTable(elem, walk, builder, formatOptions) : formatBlock(elem, walk, builder, formatOptions);
}
function formatBlock(elem, walk, builder, formatOptions) {
	builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks });
	walk(elem.children, builder);
	builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks });
}
/**
* Process a data table.
*
* @type { FormatCallback }
*/
function formatDataTable(elem, walk, builder, formatOptions) {
	builder.openTable();
	elem.children.forEach(walkTable);
	builder.closeTable({
		tableToString: (rows) => tableToString(rows, formatOptions.rowSpacing ?? 0, formatOptions.colSpacing ?? 3),
		leadingLineBreaks: formatOptions.leadingLineBreaks,
		trailingLineBreaks: formatOptions.trailingLineBreaks
	});
	function formatCell(cellNode) {
		const colspan = +get(cellNode, ["attribs", "colspan"]) || 1;
		const rowspan = +get(cellNode, ["attribs", "rowspan"]) || 1;
		builder.openTableCell({ maxColumnWidth: formatOptions.maxColumnWidth });
		walk(cellNode.children, builder);
		builder.closeTableCell({
			colspan,
			rowspan
		});
	}
	function walkTable(elem) {
		if (elem.type !== "tag") return;
		const formatHeaderCell = formatOptions.uppercaseHeaderCells !== false ? (cellNode) => {
			builder.pushWordTransform((str) => str.toUpperCase());
			formatCell(cellNode);
			builder.popWordTransform();
		} : formatCell;
		switch (elem.name) {
			case "thead":
			case "tbody":
			case "tfoot":
			case "center":
				elem.children.forEach(walkTable);
				return;
			case "tr":
				builder.openTableRow();
				for (const childOfTr of elem.children) {
					if (childOfTr.type !== "tag") continue;
					switch (childOfTr.name) {
						case "th":
							formatHeaderCell(childOfTr);
							break;
						case "td": formatCell(childOfTr);
					}
				}
				builder.closeTableRow();
		}
	}
}
var textFormatters = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	anchor: formatAnchor,
	blockquote: formatBlockquote,
	dataTable: formatDataTable,
	heading: formatHeading,
	horizontalLine: formatHorizontalLine,
	image: formatImage,
	lineBreak: formatLineBreak,
	orderedList: formatOrderedList,
	paragraph: formatParagraph,
	pre: formatPre,
	table: formatTable,
	unorderedList: formatUnorderedList,
	wbr: formatWbr
});
/**
* Default options.
*
* @constant
* @type { Options }
* @default
* @private
*/
var DEFAULT_OPTIONS = {
	baseElements: {
		selectors: ["body"],
		orderBy: "selectors",
		returnDomByDefault: true
	},
	decodeEntities: true,
	encodeCharacters: {},
	formatters: {},
	limits: {
		ellipsis: "...",
		maxBaseElements: void 0,
		maxChildNodes: void 0,
		maxDepth: void 0,
		maxInputLength: 1 << 24
	},
	longWordSplit: {
		forceWrapOnLimit: false,
		wrapCharacters: []
	},
	preserveNewlines: false,
	selectors: [
		{
			selector: "*",
			format: "inline"
		},
		{
			selector: "a",
			format: "anchor",
			options: {
				baseUrl: null,
				hideLinkHrefIfSameAsText: false,
				ignoreHref: false,
				linkBrackets: ["[", "]"],
				noAnchorUrl: true
			}
		},
		{
			selector: "article",
			format: "block",
			options: {
				leadingLineBreaks: 1,
				trailingLineBreaks: 1
			}
		},
		{
			selector: "aside",
			format: "block",
			options: {
				leadingLineBreaks: 1,
				trailingLineBreaks: 1
			}
		},
		{
			selector: "blockquote",
			format: "blockquote",
			options: {
				leadingLineBreaks: 2,
				trailingLineBreaks: 2,
				trimEmptyLines: true
			}
		},
		{
			selector: "br",
			format: "lineBreak"
		},
		{
			selector: "div",
			format: "block",
			options: {
				leadingLineBreaks: 1,
				trailingLineBreaks: 1
			}
		},
		{
			selector: "footer",
			format: "block",
			options: {
				leadingLineBreaks: 1,
				trailingLineBreaks: 1
			}
		},
		{
			selector: "form",
			format: "block",
			options: {
				leadingLineBreaks: 1,
				trailingLineBreaks: 1
			}
		},
		{
			selector: "h1",
			format: "heading",
			options: {
				leadingLineBreaks: 3,
				trailingLineBreaks: 2,
				uppercase: true
			}
		},
		{
			selector: "h2",
			format: "heading",
			options: {
				leadingLineBreaks: 3,
				trailingLineBreaks: 2,
				uppercase: true
			}
		},
		{
			selector: "h3",
			format: "heading",
			options: {
				leadingLineBreaks: 3,
				trailingLineBreaks: 2,
				uppercase: true
			}
		},
		{
			selector: "h4",
			format: "heading",
			options: {
				leadingLineBreaks: 2,
				trailingLineBreaks: 2,
				uppercase: true
			}
		},
		{
			selector: "h5",
			format: "heading",
			options: {
				leadingLineBreaks: 2,
				trailingLineBreaks: 2,
				uppercase: true
			}
		},
		{
			selector: "h6",
			format: "heading",
			options: {
				leadingLineBreaks: 2,
				trailingLineBreaks: 2,
				uppercase: true
			}
		},
		{
			selector: "header",
			format: "block",
			options: {
				leadingLineBreaks: 1,
				trailingLineBreaks: 1
			}
		},
		{
			selector: "hr",
			format: "horizontalLine",
			options: {
				leadingLineBreaks: 2,
				length: void 0,
				trailingLineBreaks: 2
			}
		},
		{
			selector: "img",
			format: "image",
			options: {
				baseUrl: null,
				linkBrackets: ["[", "]"]
			}
		},
		{
			selector: "main",
			format: "block",
			options: {
				leadingLineBreaks: 1,
				trailingLineBreaks: 1
			}
		},
		{
			selector: "nav",
			format: "block",
			options: {
				leadingLineBreaks: 1,
				trailingLineBreaks: 1
			}
		},
		{
			selector: "ol",
			format: "orderedList",
			options: {
				leadingLineBreaks: 2,
				trailingLineBreaks: 2
			}
		},
		{
			selector: "p",
			format: "paragraph",
			options: {
				leadingLineBreaks: 2,
				trailingLineBreaks: 2
			}
		},
		{
			selector: "pre",
			format: "pre",
			options: {
				leadingLineBreaks: 2,
				trailingLineBreaks: 2
			}
		},
		{
			selector: "section",
			format: "block",
			options: {
				leadingLineBreaks: 1,
				trailingLineBreaks: 1
			}
		},
		{
			selector: "table",
			format: "table",
			options: {
				colSpacing: 3,
				leadingLineBreaks: 2,
				maxColumnWidth: 60,
				rowSpacing: 0,
				trailingLineBreaks: 2,
				uppercaseHeaderCells: true
			}
		},
		{
			selector: "ul",
			format: "unorderedList",
			options: {
				itemPrefix: " * ",
				leadingLineBreaks: 2,
				trailingLineBreaks: 2
			}
		},
		{
			selector: "wbr",
			format: "wbr"
		}
	],
	tables: [],
	whitespaceCharacters: " 	\r\n\f​",
	wordwrap: 80
};
/**
* Preprocess options, compile selectors into a decision tree,
* return a function intended for batch processing.
*
* @param   { Options } [options]   HtmlToText options.
* @returns { (html: string, metadata?: any) => string } Pre-configured converter function.
* @static
*/
function compile(options = {}) {
	options = composeOptions({
		defaultOptions: DEFAULT_OPTIONS,
		genericFormatters,
		handleMergedOptions: handleDeprecatedOptions,
		packageFormatters: textFormatters,
		userOptions: options
	});
	return compile$1(options);
}
/**
* Convert given HTML content to plain text string.
*
* @param   { string }  html           HTML content to convert.
* @param   { Options } [options]      HtmlToText options.
* @param   { any }     [metadata]     Optional metadata for HTML document, for use in formatters.
* @returns { string }                 Plain text string.
* @static
*
* @example
* const { convert } = require('html-to-text');
* const text = convert('<h1>Hello World</h1>', {
*   wordwrap: 130
* });
* console.log(text); // HELLO WORLD
*/
function convert(html, options = {}, metadata = void 0) {
	return compile(options)(html, metadata);
}
/**
* Map previously existing and now deprecated options to the new options layout.
* This is a subject for cleanup in major releases.
*
* @param { Options } options HtmlToText options.
*/
function handleDeprecatedOptions(options) {
	if (options.tags) {
		const tagDefinitions = Object.entries(options.tags).map(([selector, definition]) => ({
			...definition,
			selector: selector || "*"
		}));
		options.selectors.push(...tagDefinitions);
		options.selectors = mergeDuplicatesPreferLast(options.selectors, ((s) => s.selector));
	}
	function set(obj, path, value) {
		const valueKey = path.pop();
		for (const key of path) {
			let nested = obj[key];
			if (!nested) {
				nested = {};
				obj[key] = nested;
			}
			obj = nested;
		}
		obj[valueKey] = value;
	}
	if (options["baseElement"]) {
		const baseElement = options["baseElement"];
		set(options, ["baseElements", "selectors"], Array.isArray(baseElement) ? baseElement : [baseElement]);
	}
	if (options["returnDomByDefault"] !== void 0) set(options, ["baseElements", "returnDomByDefault"], options["returnDomByDefault"]);
	for (const definition of options.selectors) if (definition.format === "anchor" && get(definition, ["options", "noLinkBrackets"])) set(definition, ["options", "linkBrackets"], false);
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/html5parser/dist/index.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_decode = require_decode();
var SyntaxKind = /* @__PURE__ */ ((SyntaxKind2) => {
	SyntaxKind2["Text"] = "Text";
	SyntaxKind2["Tag"] = "Tag";
	return SyntaxKind2;
})(SyntaxKind || {});
var selfCloseTags = /* @__PURE__ */ new Set([
	"area",
	"base",
	"basefont",
	"bgsound",
	"br",
	"col",
	"command",
	"embed",
	"frame",
	"hr",
	"image",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
	"!doctype",
	"",
	"!",
	"!--"
]);
var noNestedTags = /* @__PURE__ */ new Set([
	"li",
	"option",
	"select",
	"textarea"
]);
var rcDataTags = /* @__PURE__ */ new Set(["title", "textarea"]);
var rawTextTags = /* @__PURE__ */ new Set([
	"style",
	"xmp",
	"iframe",
	"noembed",
	"noframes"
]);
var scriptDataTags = /* @__PURE__ */ new Set(["script"]);
var scriptingRawTextTags = /* @__PURE__ */ new Set(["noscript"]);
var plainTextTags = /* @__PURE__ */ new Set(["plaintext"]);
var state;
var buffer;
var bufSize;
var sectionStart;
var index;
var tokens;
var char;
var offset;
var textMode;
var textEndTag;
var pendingTextMode;
var pendingTextTag;
var tokenizeOptions;
function makeCodePoints(input) {
	return {
		lower: input.toLowerCase().split("").map((c) => c.charCodeAt(0)),
		upper: input.toUpperCase().split("").map((c) => c.charCodeAt(0)),
		length: input.length
	};
}
var doctype = makeCodePoints("!doctype");
function isWhiteSpace() {
	return char === 32 || char === 10 || char === 9 || char === 9 || char === 13 || char === 12;
}
function init(input, options) {
	state = 0;
	buffer = input;
	bufSize = input.length;
	sectionStart = 0;
	index = 0;
	tokens = [];
	offset = 0;
	textMode = 0;
	textEndTag = void 0;
	pendingTextMode = 0;
	pendingTextTag = "";
	tokenizeOptions = options;
}
function getTextMode(tagName) {
	if (rcDataTags.has(tagName)) return 1;
	if (rawTextTags.has(tagName)) return 2;
	if (scriptDataTags.has(tagName)) return 3;
	if (plainTextTags.has(tagName)) return 4;
	if (tokenizeOptions.scriptingEnabled && scriptingRawTextTags.has(tagName)) return 2;
	return 0;
}
function setPendingTextMode(tagName) {
	pendingTextTag = tagName;
	pendingTextMode = getTextMode(tagName);
}
function activatePendingTextMode(openTagEnd) {
	if (openTagEnd !== "/" && pendingTextMode !== 0) {
		textMode = pendingTextMode;
		textEndTag = makeCodePoints(pendingTextTag);
		if (pendingTextTag === "textarea" && buffer.charCodeAt(sectionStart) === 10) {
			sectionStart++;
			index++;
		}
	}
	pendingTextMode = 0;
	pendingTextTag = "";
}
function resetTextMode() {
	textMode = 0;
	textEndTag = void 0;
}
function resetTextClosingTag() {
	sectionStart -= 2;
	state = 0;
}
function tokenize(input, options = {}) {
	init(input, { scriptingEnabled: options.scriptingEnabled !== false });
	while (index < bufSize) {
		char = buffer.charCodeAt(index);
		switch (state) {
			case 0:
				parseLiteral();
				break;
			case 1:
				parseBeforeOpenTag();
				break;
			case 2:
				parseOpeningTag();
				break;
			case 3:
				parseAfterOpenTag();
				break;
			case 4:
				parseInValueNq();
				break;
			case 5:
				parseInValueSq();
				break;
			case 6:
				parseInValueDq();
				break;
			case 7:
				parseClosingOpenTag();
				break;
			case 8:
				parseOpeningSpecial();
				break;
			case 9:
				parseOpeningDoctype();
				break;
			case 10:
				parseOpeningNormalComment();
				break;
			case 11:
				parseNormalComment();
				break;
			case 12:
				parseShortComment();
				break;
			case 13:
				parseClosingNormalComment();
				break;
			case 14:
				parseClosingTag();
				break;
			default: unexpected();
		}
		index++;
	}
	switch (state) {
		case 0:
		case 1:
		case 4:
		case 5:
		case 6:
		case 7:
		case 11:
		case 12:
		case 13:
			emitToken(0);
			break;
		case 2:
			emitToken(1);
			break;
		case 3: break;
		case 8:
			emitToken(1, 12);
			break;
		case 9:
			if (index - sectionStart === doctype.length) emitToken(1);
			else {
				emitToken(1, void 0, sectionStart + 1);
				emitToken(0);
			}
			break;
		case 10:
			if (index - sectionStart === 2) emitToken(1);
			else {
				emitToken(1, void 0, sectionStart + 1);
				emitToken(0);
			}
			break;
		case 14: emitToken(3);
	}
	const _tokens = tokens;
	init("", tokenizeOptions);
	return _tokens;
}
function emitToken(kind, newState = state, end = index) {
	let value = buffer.substring(sectionStart, end);
	if (kind === 1 || kind === 3) value = value.toLowerCase();
	if (kind === 1) setPendingTextMode(value);
	if (kind === 3) resetTextMode();
	if (!((kind === 0 || kind === 4) && end === sectionStart)) tokens.push({
		type: kind,
		start: sectionStart,
		end,
		value
	});
	if (kind === 2 || kind === 3) {
		sectionStart = end + 1;
		state = 0;
		if (kind === 2) activatePendingTextMode(value);
	} else {
		sectionStart = end;
		state = newState;
	}
}
function parseLiteral() {
	if (textMode === 4) return;
	if (char === 60) emitToken(0, 1);
}
function parseBeforeOpenTag() {
	if (textMode !== 0) {
		if (char === 47) {
			state = 14;
			sectionStart = index + 1;
		} else state = 0;
		return;
	}
	if (char >= 97 && char <= 122 || char >= 65 && char <= 90) {
		state = 2;
		sectionStart = index;
	} else if (char === 47) {
		state = 14;
		sectionStart = index + 1;
	} else if (char === 60) emitToken(0);
	else if (char === 33) {
		state = 8;
		sectionStart = index;
	} else if (char === 63) {
		sectionStart = index;
		emitToken(1, 12);
	} else state = 0;
}
function parseOpeningTag() {
	if (isWhiteSpace()) emitToken(1, 3);
	else if (char === 62) {
		emitToken(1);
		emitToken(2);
	} else if (char === 47) emitToken(1, 7);
}
function parseAfterOpenTag() {
	if (char === 62) {
		emitToken(4);
		emitToken(2);
	} else if (char === 47) emitToken(4, 7);
	else if (char === 61) {
		emitToken(4);
		emitToken(5, void 0, index + 1);
	} else if (char === 39) emitToken(4, 5);
	else if (char === 34) emitToken(4, 6);
	else if (!isWhiteSpace()) emitToken(4, 4);
}
function parseInValueNq() {
	if (char === 62) {
		emitToken(6);
		emitToken(2);
	} else if (char === 47) emitToken(6, 7);
	else if (char === 61) {
		emitToken(6);
		emitToken(5, 3, index + 1);
	} else if (isWhiteSpace()) emitToken(6, 3);
}
function parseInValueSq() {
	if (char === 39) emitToken(7, 3, index + 1);
}
function parseInValueDq() {
	if (char === 34) emitToken(8, 3, index + 1);
}
function parseClosingOpenTag() {
	if (char === 62) emitToken(2);
	else {
		emitToken(6, 3);
		parseAfterOpenTag();
	}
}
function parseOpeningSpecial() {
	switch (char) {
		case 45:
			state = 10;
			break;
		case 100:
		case 68:
			state = 9;
			break;
		default: emitToken(1, 12);
	}
}
function parseOpeningDoctype() {
	offset = index - sectionStart;
	if (offset === doctype.length) if (isWhiteSpace()) emitToken(1, 3);
	else unexpected();
	else if (char === 62) {
		emitToken(1, void 0, sectionStart + 1);
		emitToken(0);
		emitToken(2);
	} else if (doctype.lower[offset] !== char && doctype.upper[offset] !== char) emitToken(1, 12, sectionStart + 1);
}
function parseOpeningNormalComment() {
	if (char === 45) emitToken(1, 11, index + 1);
	else emitToken(1, 12, sectionStart + 1);
}
function parseNormalComment() {
	if (char === 45) emitToken(0, 13);
}
function parseShortComment() {
	if (char === 62) {
		emitToken(0);
		emitToken(2);
	}
}
function parseClosingNormalComment() {
	offset = index - sectionStart;
	if (offset === 2) if (char === 62) emitToken(2);
	else if (char === 45) emitToken(0, void 0, sectionStart + 1);
	else state = 11;
	else if (char !== 45) state = 11;
}
function parseClosingTag() {
	offset = index - sectionStart;
	if (textMode !== 0) {
		const endTag = textEndTag;
		if (!endTag) unexpected();
		if (char === 60) {
			resetTextClosingTag();
			emitToken(0, 1);
		} else if (offset < endTag.length) {
			if (endTag.lower[offset] !== char && endTag.upper[offset] !== char) resetTextClosingTag();
		} else if (char === 62) emitToken(3);
		else if (!isWhiteSpace()) resetTextClosingTag();
	} else if (char === 62) emitToken(3);
}
function unexpected() {
	throw new SyntaxError(`Unexpected token "${buffer.charAt(index)}" at ${index} when parse ${state}`);
}
function getLineRanges(input) {
	return input.split("\n").reduce((arr, line) => {
		arr.push(line.length + 1 + arr[arr.length - 1]);
		return arr;
	}, [0]);
}
function getPosition(ranges, offset2) {
	let line = NaN;
	let column = NaN;
	for (let i = 1; i < ranges.length; i++) if (ranges[i] > offset2) {
		line = i;
		column = offset2 - ranges[i - 1] + 1;
		break;
	}
	return [line, column];
}
function visit(node2, parent, index3, options) {
	options.enter && options.enter(node2, parent, index3);
	if (node2.type === "Tag" && Array.isArray(node2.body)) for (let i = 0; i < node2.body.length; i++) visit(node2.body[i], node2, i, options);
	options.leave && options.leave(node2, parent, index3);
}
function walk(ast, options) {
	for (let i = 0; i < ast.length; i++) visit(ast[i], void 0, i, options);
}
var index2;
var count;
var tokens2;
var tagChain;
var nodes;
var token;
var node;
var buffer2;
var lines;
var parseOptions;
function init2(input, options) {
	if (input === void 0) {
		count = 0;
		tokens2.length = 0;
		buffer2 = "";
	} else {
		tokens2 = tokenize(input, { scriptingEnabled: options?.scriptingEnabled });
		count = tokens2.length;
		buffer2 = input;
	}
	index2 = 0;
	tagChain = void 0;
	nodes = [];
	token = void 0;
	node = void 0;
	lines = void 0;
	parseOptions = options;
}
function pushNode(_node) {
	if (!tagChain) nodes.push(_node);
	else if (_node.type === "Tag" && _node.name === tagChain.tag.name && noNestedTags.has(_node.name)) {
		tagChain = tagChain.parent;
		pushNode(_node);
	} else if (tagChain.tag.body) {
		tagChain.tag.end = _node.end;
		tagChain.tag.body.push(_node);
	}
}
function pushTagChain(tag) {
	tagChain = {
		parent: tagChain,
		tag
	};
	node = void 0;
}
function createLiteral(start = token.start, end = token.end, value = token.value) {
	return {
		start,
		end,
		value,
		type: "Text"
	};
}
function createTag() {
	return {
		start: token.start - 1,
		end: token.end,
		type: "Tag",
		open: createLiteral(token.start - 1),
		name: token.value,
		rawName: buffer2.substring(token.start, token.end),
		attributes: [],
		attributeMap: void 0,
		body: null,
		close: null
	};
}
function createAttribute() {
	return {
		start: token.start,
		end: token.end,
		name: createLiteral(),
		value: void 0
	};
}
function createAttributeValue() {
	return {
		start: token.start,
		end: token.end,
		value: token.type === 6 ? token.value : token.value.substr(1, token.value.length - 2),
		quote: token.type === 6 ? void 0 : token.type === 7 ? "'" : "\""
	};
}
function appendLiteral(_node = node) {
	_node.value += token.value;
	_node.end = token.end;
}
function unexpected2() {
	if (lines === void 0) lines = getLineRanges(buffer2);
	const [line, column] = getPosition(lines, token.start);
	throw new Error(`Unexpected token "${token.value}(${token.type})" at [${line},${column}]` + (tagChain ? ` when parsing tag: ${JSON.stringify(tagChain.tag.name)}.` : ""));
}
function buildAttributeMap(tag) {
	tag.attributeMap = {};
	for (const attr of tag.attributes) tag.attributeMap[attr.name.value] = attr;
}
function parseOpenTag() {
	let state2 = 0;
	let attr = void 0;
	const tag = createTag();
	pushNode(tag);
	if (tag.name === "" || tag.name === "!" || tag.name === "!--") {
		tag.open.value = "<" + tag.open.value;
		if (index2 === count) return;
		else {
			token = tokens2[++index2];
			if (token.type !== 2) {
				node = createLiteral();
				tag.body = [node];
				while (++index2 < count) {
					token = tokens2[index2];
					if (token.type === 2) {
						node = void 0;
						break;
					}
					appendLiteral();
				}
			}
			tag.close = createLiteral(token.start, token.end + 1, `${token.value}>`);
			tag.end = tag.close.end;
		}
		return;
	}
	while (++index2 < count) {
		token = tokens2[index2];
		if (token.type === 2) {
			tag.end = tag.open.end = token.end + 1;
			tag.open.value = buffer2.substring(tag.open.start, tag.open.end);
			if (token.value === "" && !selfCloseTags.has(tag.name)) {
				tag.body = [];
				pushTagChain(tag);
			} else tag.body = void 0;
			break;
		} else if (state2 === 0) {
			if (token.type !== 4) {
				attr = createAttribute();
				state2 = 1;
				tag.attributes.push(attr);
			}
		} else if (state2 === 1) if (token.type === 4) state2 = 2;
		else if (token.type === 5) state2 = 3;
		else appendLiteral(attr.name);
		else if (state2 === 2) {
			if (token.type !== 4) if (token.type === 5) state2 = 3;
			else {
				attr = createAttribute();
				state2 = 1;
				tag.attributes.push(attr);
			}
		} else if (state2 === 3) {
			if (token.type !== 4) {
				attr.value = createAttributeValue();
				if (token.type === 6) state2 = 4;
				else {
					attr.end = attr.value.end;
					state2 = 0;
				}
			}
		} else if (token.type === 4) {
			attr.end = attr.value.end;
			state2 = 0;
		} else appendLiteral(attr.value);
	}
}
function parseCloseTag() {
	let _context = tagChain;
	while (true) {
		if (!_context || token.value.trim() === _context.tag.name) break;
		_context = _context.parent;
	}
	if (!_context) return;
	_context.tag.close = createLiteral(token.start - 2, token.end + 1, buffer2.substring(token.start - 2, token.end + 1));
	_context.tag.end = _context.tag.close.end;
	_context = _context.parent;
	tagChain = _context;
}
function parse(input, options) {
	init2(input, {
		setAttributeMap: false,
		scriptingEnabled: true,
		...options
	});
	while (index2 < count) {
		token = tokens2[index2];
		switch (token.type) {
			case 0:
				if (!node) {
					node = createLiteral();
					pushNode(node);
				} else appendLiteral(node);
				break;
			case 1:
				node = void 0;
				parseOpenTag();
				break;
			case 3:
				node = void 0;
				parseCloseTag();
				break;
			default: unexpected2();
		}
		index2++;
	}
	const _nodes = nodes;
	if (parseOptions?.setAttributeMap) walk(_nodes, { enter(node2) {
		if (node2.type === "Tag") buildAttributeMap(node2);
	} });
	init2();
	return _nodes;
}
//#endregion
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/@react-email/render/dist/edge/index.mjs
var import_jsx_runtime = require_jsx_runtime();
function getHtmlNode(path) {
	const topNode = path.node;
	if (topNode) return topNode;
	return path.stack?.[path.stack.length - 1];
}
function recursivelyMapDoc(doc, callback) {
	if (Array.isArray(doc)) return doc.map((innerDoc) => recursivelyMapDoc(innerDoc, callback));
	if (typeof doc === "object") {
		if (doc.type === "line") return callback(doc.soft ? "" : " ");
		if (doc.type === "group") return {
			...doc,
			contents: recursivelyMapDoc(doc.contents, callback),
			expandedStates: recursivelyMapDoc(doc.expandedStates, callback)
		};
		if ("contents" in doc) return {
			...doc,
			contents: recursivelyMapDoc(doc.contents, callback)
		};
		if ("parts" in doc) return {
			...doc,
			parts: recursivelyMapDoc(doc.parts, callback)
		};
		if (doc.type === "if-break") return {
			...doc,
			breakContents: recursivelyMapDoc(doc.breakContents, callback),
			flatContents: recursivelyMapDoc(doc.flatContents, callback)
		};
		const nextDoc = { ...doc };
		for (const [key, value] of Object.entries(nextDoc)) if (value && typeof value === "object") nextDoc[key] = recursivelyMapDoc(value, callback);
		return nextDoc;
	}
	return callback(doc);
}
function createModifiedHtmlPlugin(html) {
	const modifiedHtml = { ...html };
	if (modifiedHtml.printers) {
		const previousPrint = modifiedHtml.printers.html.print;
		modifiedHtml.printers.html.print = (path, options, print, args) => {
			const node = getHtmlNode(path);
			const rawPrintingResult = previousPrint(path, options, print, args);
			if (node?.type === "ieConditionalComment" || node?.kind === "ieConditionalComment") return recursivelyMapDoc(rawPrintingResult, (doc) => {
				if (typeof doc === "object" && doc.type === "line") return doc.soft ? "" : " ";
				return doc;
			});
			return rawPrintingResult;
		};
	}
	return modifiedHtml;
}
var importPrettier = async () => {
	const [{ format }, html] = await Promise.all([import("../_7.mjs"), import("../_6.mjs")]);
	return {
		format,
		html: createModifiedHtmlPlugin(html)
	};
};
/**
* Prettier is only loaded the first time `pretty` is called, so importing
* `render` doesn't load it when `pretty` is never used. This also keeps
* bundlers that externalize `prettier` (e.g. Next.js with Turbopack) from
* trying to resolve it at runtime unless it's actually needed.
*/
var prettierPromise;
var defaults = {
	endOfLine: "lf",
	tabWidth: 2,
	bracketSameLine: true,
	parser: "html"
};
var pretty = async (str, options = {}) => {
	prettierPromise ??= importPrettier();
	const { format, html } = await prettierPromise;
	return format(str.replaceAll("\0", ""), {
		...defaults,
		plugins: [html],
		...options
	});
};
var plainTextSelectors = [
	{
		selector: "img",
		format: "skip"
	},
	{
		selector: "[data-skip-in-text=true]",
		format: "skip"
	},
	{
		selector: "a",
		options: {
			linkBrackets: false,
			hideLinkHrefIfSameAsText: true
		}
	},
	{
		selector: "[data-text-format=\"dataTable\"]",
		format: "dataTable"
	}
];
function toPlainText(html, options) {
	return convert(html, {
		wordwrap: false,
		...options,
		selectors: [...plainTextSelectors, ...options?.selectors ?? []]
	});
}
var SKIPPED_TAGS = /* @__PURE__ */ new Set([
	"img",
	"noscript",
	"script",
	"style",
	"template"
]);
var WHITESPACE_RUN = /([ \t\n\r\f\u200b]+)/;
var TAG_BLOCKS = {
	article: {
		open: 2,
		close: 2
	},
	aside: {
		open: 2,
		close: 2
	},
	blockquote: {
		open: 2,
		close: 2,
		prefix: {
			first: "> ",
			rest: "> "
		}
	},
	div: {
		open: 2,
		close: 2
	},
	footer: {
		open: 2,
		close: 2
	},
	form: {
		open: 2,
		close: 2
	},
	h1: {
		open: 3,
		close: 2
	},
	h2: {
		open: 3,
		close: 2
	},
	h3: {
		open: 3,
		close: 2
	},
	h4: {
		open: 3,
		close: 2
	},
	h5: {
		open: 3,
		close: 2
	},
	h6: {
		open: 3,
		close: 2
	},
	header: {
		open: 2,
		close: 2
	},
	hr: {
		open: 2,
		close: 2
	},
	main: {
		open: 2,
		close: 2
	},
	nav: {
		open: 2,
		close: 2
	},
	p: {
		open: 2,
		close: 2
	},
	pre: {
		open: 2,
		close: 2
	},
	section: {
		open: 2,
		close: 2
	},
	table: {
		open: 2,
		close: 2
	}
};
function unstableToPlainText(html) {
	const tree = parse(html, { setAttributeMap: true });
	const body = findBody(tree);
	const blocks = [{
		block: {
			open: 0,
			close: 0
		},
		text: [],
		leading: 0,
		stash: 0,
		space: false
	}];
	const stack = [{
		parent: body,
		children: body?.body ?? tree,
		index: 0,
		pre: false,
		opened: false,
		textFrom: 0,
		orderedList: void 0
	}];
	while (stack.length > 0) {
		const frame = stack[stack.length - 1];
		const node = frame.children[frame.index];
		if (node === void 0) {
			stack.pop();
			exitElement(frame.parent, frame);
			continue;
		}
		frame.index += 1;
		enterNode(node, frame);
	}
	function top() {
		return blocks[blocks.length - 1];
	}
	function writeWord(value) {
		const block = top();
		if (block.stash > 0) block.text.push("\n".repeat(block.stash));
		else if (block.space && block.text.length > 0) block.text.push(" ");
		block.stash = 0;
		block.space = false;
		block.text.push(value);
	}
	function enterNode(node, frame) {
		if (node.type === SyntaxKind.Text) {
			const value = (0, import_decode.decodeHTML)(node.value);
			if (frame.pre) {
				if (value.length > 0) writeWord(value);
			} else {
				const segments = value.split(WHITESPACE_RUN);
				for (let i = 0; i < segments.length; i++) {
					const segment = segments[i];
					if (segment.length === 0) continue;
					if (i % 2 === 1) top().space = true;
					else writeWord(segment);
				}
			}
			return;
		}
		if (SKIPPED_TAGS.has(node.name) || (0, import_decode.decodeHTMLAttribute)(node.attributeMap?.["data-skip-in-text"]?.value?.value ?? "") === "true") return;
		const parentTag = frame.parent?.name;
		let block = TAG_BLOCKS[node.name];
		let orderedList;
		if (node.name === "ul") {
			const breaks = parentTag === "li" ? 1 : 2;
			block = {
				open: breaks,
				close: breaks
			};
		} else if (node.name === "li" && parentTag === "ul") block = {
			open: 1,
			close: 1,
			prefix: (stack[stack.length - 2]?.parent)?.name === "li" ? {
				first: "* ",
				rest: "  "
			} : {
				first: " * ",
				rest: "   "
			}
		};
		else if (node.name === "ol") {
			const nested = parentTag === "li";
			const parsedStart = Number.parseInt((0, import_decode.decodeHTMLAttribute)(node.attributeMap?.start?.value?.value ?? "1"), 10);
			const start = Number.isNaN(parsedStart) ? 1 : parsedStart;
			const itemCount = node.body?.filter((child) => child.type === SyntaxKind.Tag && child.name === "li").length ?? 0;
			let prefixLength = 0;
			for (let index = start; index < start + itemCount; index++) {
				const prefix = `${nested ? "" : " "}${index}. `;
				prefixLength = Math.max(prefixLength, prefix.length);
			}
			const breaks = nested ? 1 : 2;
			block = {
				open: breaks,
				close: breaks
			};
			orderedList = {
				next: start,
				prefixLength,
				nested
			};
		} else if (node.name === "li" && parentTag === "ol" && frame.orderedList) {
			const list = frame.orderedList;
			block = {
				open: 1,
				close: 1,
				prefix: {
					first: `${list.nested ? "" : " "}${list.next++}. `.padEnd(list.prefixLength),
					rest: " ".repeat(list.prefixLength)
				}
			};
		}
		if (block) blocks.push({
			block,
			text: [],
			leading: block.open,
			stash: 0,
			space: false
		});
		if (node.name === "hr") writeWord("-".repeat(40));
		else if (node.name === "br") {
			top().space = false;
			top().text.push("\n");
		}
		stack.push({
			parent: node,
			children: node.body ?? [],
			index: 0,
			pre: frame.pre || node.name === "pre",
			opened: block !== void 0,
			textFrom: top().text.length,
			orderedList
		});
	}
	function exitElement(element, frame) {
		if (element === void 0) return;
		if (element.name === "a") {
			const href = (0, import_decode.decodeHTMLAttribute)(element.attributeMap?.href?.value?.value ?? "").replace(/^mailto:/, "");
			if (href.length > 0 && !href.startsWith("#")) {
				const anchorText = top().text.slice(frame.textFrom).join("");
				if (anchorText !== href) {
					if (anchorText.length > 0) top().space = true;
					writeWord(href);
				}
			}
		}
		if (frame.opened) closeBlock();
	}
	function closeBlock() {
		const child = blocks.pop();
		if (child === void 0) return;
		const parent = blocks[blocks.length - 1];
		let content = child.text.join("");
		const prefix = child.block.prefix;
		if (prefix !== void 0) {
			const trimmed = content.replace(/^\n+|\n+$/g, "");
			content = prefix.first + trimmed.replaceAll("\n", `\n${prefix.rest}`);
		}
		const breaks = Math.max(parent.stash, child.leading);
		if (parent.text.length > 0) {
			parent.text.push("\n".repeat(breaks));
			if (content.length > 0) parent.text.push(content);
		} else {
			if (content.length > 0) parent.text.push(content);
			parent.leading = breaks;
		}
		parent.stash = Math.max(child.stash, child.block.close);
	}
	return blocks[0].text.join("");
}
function findBody(tree) {
	for (const child of tree) {
		if (child.type !== SyntaxKind.Tag || child.name !== "html") continue;
		for (const inner of child.body ?? []) if (inner.type === SyntaxKind.Tag && inner.name === "body") return inner;
	}
}
function createErrorBoundary(reject) {
	if (!import_react.Component) return (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: props.children });
	return class ErrorBoundary extends import_react.Component {
		componentDidCatch(error) {
			reject(error);
		}
		render() {
			return this.props.children;
		}
	};
}
/**
* React injects `<link rel="preload" as="image" />` resource hints into the
* document `<head>` for every `<img>` it renders during server-side rendering.
*
* These hints are meant for browsers loading a web page, where they can speed
* up the initial paint. In an email they are dead weight: email clients ignore
* `<link rel="preload">`, and the tags only add noise to the rendered HTML.
*
* @see https://github.com/resend/react-email/issues/3034
*
* This removes only those auto-injected image preload links, leaving every
* other `<link>` (stylesheets, fonts, user-authored non-image preloads, ...)
* untouched. It parses each `<link>` tag's attributes instead of relying on a
* fixed string match, so it is not affected by attribute order or spacing.
*/
var stripImagePreloadLinks = (html) => {
	return html.replace(/<link\b[^>]*\/?>/gi, (tag) => isImagePreloadLink(tag) ? "" : tag);
};
var isImagePreloadLink = (tag) => {
	const attributes = parseAttributes(tag);
	return attributes.rel === "preload" && attributes.as === "image";
};
var ATTRIBUTE_PATTERN = /([a-z][a-z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/gi;
/**
* Parses the attributes of a single, already-isolated HTML tag string (e.g.
* `<link rel="preload" as="image" href="..." />`) into a name → value map.
* Attribute names are lower-cased; values are read from double, single, or
* unquoted forms.
*/
var parseAttributes = (tag) => {
	const attributeSection = tag.replace(/^<[a-z][a-z0-9-]*/i, "");
	const attributes = {};
	for (const [, name, doubleQuoted, singleQuoted, unquoted] of attributeSection.matchAll(ATTRIBUTE_PATTERN)) attributes[name.toLowerCase()] = doubleQuoted ?? singleQuoted ?? unquoted ?? "";
	return attributes;
};
var decoder = new TextDecoder("utf-8");
var readStream = async (stream) => {
	const chunks = [];
	const writableStream = new WritableStream({
		write(chunk) {
			chunks.push(chunk);
		},
		abort(reason) {
			throw new Error("Stream aborted", { cause: { reason } });
		}
	});
	await stream.pipeTo(writableStream);
	let length = 0;
	chunks.forEach((item) => {
		length += item.length;
	});
	const mergedChunks = new Uint8Array(length);
	let offset = 0;
	chunks.forEach((item) => {
		mergedChunks.set(item, offset);
		offset += item.length;
	});
	return decoder.decode(mergedChunks);
};
var importReactDom = () => {
	return import("../_20.mjs").then((m) => /* @__PURE__ */ __toESM(m.default, 1)).catch(() => import("../_20.mjs").then((m) => /* @__PURE__ */ __toESM(m.default, 1)));
};
var render = async (element, options) => {
	const reactDOMServer = await importReactDom().then((m) => {
		if ("default" in m) return m.default;
		return m;
	});
	const html = await new Promise((resolve, reject) => {
		const ErrorBoundary = createErrorBoundary(reject);
		reactDOMServer.renderToReadableStream(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, { children: element }) }), {
			onError(error) {
				reject(error);
			},
			progressiveChunkSize: Number.POSITIVE_INFINITY
		}).then(async (stream) => {
			await stream.allReady;
			return readStream(stream);
		}).then((result) => resolve(stripImagePreloadLinks(result))).catch(reject);
	});
	if (options?.plainText) return options.unstableTextConversion ? unstableToPlainText(html) : toPlainText(html, options.htmlToTextOptions);
	const document = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">${html.replace(/<!DOCTYPE.*?>/, "")}`;
	if (options?.pretty) return pretty(document);
	return document;
};
//#endregion
export { toPlainText as i, pretty as n, render as r, plainTextSelectors as t };
