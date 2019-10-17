// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"8fxs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ['average', 'big', 'colossal', 'fat', 'giant', 'gigantic', 'great', 'huge', 'immense', 'large', 'little', 'long', 'mammoth', 'massive', 'miniature', 'petite', 'puny', 'short', 'small', 'tall', 'tiny', 'boiling', 'breezy', 'broken', 'bumpy', 'chilly', 'cold', 'cool', 'creepy', 'crooked', 'cuddly', 'curly', 'damaged', 'damp', 'dirty', 'dry', 'dusty', 'filthy', 'flaky', 'fluffy', 'wet', 'broad', 'chubby', 'crooked', 'curved', 'deep', 'flat', 'high', 'hollow', 'low', 'narrow', 'round', 'shallow', 'skinny', 'square', 'steep', 'straight', 'wide', 'ancient', 'brief', 'early', 'fast', 'late', 'long', 'modern', 'old', 'quick', 'rapid', 'short', 'slow', 'swift', 'young', 'abundant', 'empty', 'few', 'heavy', 'light', 'many', 'numerous', 'Sound', 'cooing', 'deafening', 'faint', 'harsh', 'hissing', 'hushed', 'husky', 'loud', 'melodic', 'moaning', 'mute', 'noisy', 'purring', 'quiet', 'raspy', 'resonant', 'screeching', 'shrill', 'silent', 'soft', 'squealing', 'thundering', 'voiceless', 'whispering', 'bitter', 'delicious', 'fresh', 'juicy', 'ripe', 'rotten', 'salty', 'sour', 'spicy', 'stale', 'sticky', 'strong', 'sweet', 'tasteless', 'tasty', 'thirsty', 'fluttering', 'fuzzy', 'greasy', 'grubby', 'hard', 'hot', 'icy', 'loose', 'melted', 'plastic', 'prickly', 'rainy', 'rough', 'scattered', 'shaggy', 'shaky', 'sharp', 'shivering', 'silky', 'slimy', 'slippery', 'smooth', 'soft', 'solid', 'steady', 'sticky', 'tender', 'tight', 'uneven', 'weak', 'wet', 'wooden', 'afraid', 'angry', 'annoyed', 'anxious', 'arrogant', 'ashamed', 'awful', 'bad', 'bewildered', 'bored', 'combative', 'condemned', 'confused', 'creepy', 'cruel', 'dangerous', 'defeated', 'defiant', 'depressed', 'disgusted', 'disturbed', 'eerie', 'embarrassed', 'envious', 'evil', 'fierce', 'foolish', 'frantic', 'frightened', 'grieving', 'helpless', 'homeless', 'hungry', 'hurt', 'ill', 'jealous', 'lonely', 'mysterious', 'naughty', 'nervous', 'obnoxious', 'outrageous', 'panicky', 'repulsive', 'scary', 'scornful', 'selfish', 'sore', 'tense', 'terrible', 'thoughtless', 'tired', 'troubled', 'upset', 'uptight', 'weary', 'wicked', 'worried', 'agreeable', 'amused', 'brave', 'calm', 'charming', 'cheerful', 'comfortable', 'cooperative', 'courageous', 'delightful', 'determined', 'eager', 'elated', 'enchanting', 'encouraging', 'energetic', 'enthusiastic', 'excited', 'exuberant', 'fair', 'faithful', 'fantastic', 'fine', 'friendly', 'funny', 'gentle', 'glorious', 'good', 'happy', 'healthy', 'helpful', 'hilarious', 'jolly', 'joyous', 'kind', 'lively', 'lovely', 'lucky', 'obedient', 'perfect', 'pleasant', 'proud', 'relieved', 'silly', 'smiling', 'splendid', 'successful', 'thoughtful', 'victorious', 'vivacious', 'witty', 'wonderful', 'zealous', 'zany', 'other', 'good', 'new', 'old', 'great', 'high', 'small', 'different', 'large', 'local', 'social', 'important', 'long', 'young', 'national', 'british', 'right', 'early', 'possible', 'big', 'little', 'political', 'able', 'late', 'general', 'full', 'far', 'low', 'public', 'available', 'bad', 'main', 'sure', 'clear', 'major', 'economic', 'only', 'likely', 'real', 'black', 'particular', 'international', 'special', 'difficult', 'certain', 'open', 'whole', 'white', 'free', 'short', 'easy', 'strong', 'european', 'central', 'similar', 'human', 'common', 'necessary', 'single', 'personal', 'hard', 'private', 'poor', 'financial', 'wide', 'foreign', 'simple', 'recent', 'concerned', 'american', 'various', 'close', 'fine', 'english', 'wrong', 'present', 'royal', 'natural', 'individual', 'nice', 'french', 'following', 'current', 'modern', 'labour', 'legal', 'happy', 'final', 'red', 'normal', 'serious', 'previous', 'total', 'prime', 'significant', 'industrial', 'sorry', 'dead', 'specific', 'appropriate', 'top', 'soviet', 'basic', 'military', 'original', 'successful', 'aware', 'hon', 'popular', 'heavy', 'professional', 'direct', 'dark', 'cold', 'ready', 'green', 'useful', 'effective', 'western', 'traditional', 'scottish', 'german', 'independent', 'deep', 'interesting', 'considerable', 'involved', 'physical', 'left', 'hot', 'existing', 'responsible', 'complete', 'medical', 'blue', 'extra', 'past', 'male', 'interested', 'fair', 'essential', 'beautiful', 'civil', 'primary', 'obvious', 'future', 'environmental', 'positive', 'senior', 'nuclear', 'annual', 'relevant', 'huge', 'rich', 'commercial', 'safe', 'regional', 'practical', 'official', 'separate', 'key', 'chief', 'regular', 'due', 'additional', 'active', 'powerful', 'complex', 'standard', 'impossible', 'light', 'warm', 'middle', 'fresh', 'sexual', 'front', 'domestic', 'actual', 'united', 'technical', 'ordinary', 'cheap', 'strange', 'internal', 'excellent', 'quiet', 'soft', 'potential', 'northern', 'religious', 'quick', 'very', 'famous', 'cultural', 'proper', 'broad', 'joint', 'formal', 'limited', 'conservative', 'lovely', 'usual', 'ltd', 'unable', 'rural', 'initial', 'substantial', 'christian', 'bright', 'average', 'leading', 'reasonable', 'immediate', 'suitable', 'equal', 'detailed', 'working', 'overall', 'female', 'afraid', 'democratic', 'growing', 'sufficient', 'scientific', 'eastern', 'correct', 'inc', 'irish', 'expensive', 'educational', 'mental', 'dangerous', 'critical', 'increased', 'familiar', 'unlikely', 'double', 'perfect', 'slow', 'tiny', 'dry', 'historical', 'thin', 'daily', 'southern', 'increasing', 'wild', 'alone', 'urban', 'empty', 'married', 'narrow', 'liberal', 'supposed', 'upper', 'apparent', 'tall', 'busy', 'bloody', 'prepared', 'russian', 'moral', 'careful', 'clean', 'attractive', 'japanese', 'vital', 'thick', 'alternative', 'fast', 'ancient', 'elderly', 'rare', 'external', 'capable', 'brief', 'wonderful', 'grand', 'typical', 'entire', 'grey', 'constant', 'vast', 'surprised', 'ideal', 'terrible', 'academic', 'funny', 'minor', 'pleased', 'severe', 'ill', 'corporate', 'negative', 'permanent', 'weak', 'brown', 'fundamental', 'odd', 'crucial', 'inner', 'used', 'criminal', 'contemporary', 'sharp', 'sick', 'near', 'roman', 'massive', 'unique', 'secondary', 'parliamentary', 'african', 'unknown', 'subsequent', 'angry', 'alive', 'guilty', 'lucky', 'enormous', 'well', 'communist', 'yellow', 'unusual', 'net', 'tough', 'dear', 'extensive', 'glad', 'remaining', 'agricultural', 'alright', 'healthy', 'italian', 'principal', 'tired', 'efficient', 'comfortable', 'chinese', 'relative', 'friendly', 'conventional', 'willing', 'sudden', 'proposed', 'voluntary', 'slight', 'valuable', 'dramatic', 'golden', 'temporary', 'federal', 'keen', 'flat', 'silent', 'indian', 'worried', 'pale', 'statutory', 'welsh', 'dependent', 'firm', 'wet', 'competitive', 'armed', 'radical', 'outside', 'acceptable', 'sensitive', 'living', 'pure', 'global', 'emotional', 'sad', 'secret', 'rapid', 'adequate', 'fixed', 'sweet', 'administrative', 'wooden', 'remarkable', 'comprehensive', 'surprising', 'solid', 'rough', 'mere', 'mass', 'brilliant', 'maximum', 'absolute', 'tory', 'electronic', 'visual', 'electric', 'cool', 'spanish', 'literary', 'continuing', 'supreme', 'chemical', 'genuine', 'exciting', 'written', 'stupid', 'advanced', 'extreme', 'classical', 'fit', 'favourite', 'socialist', 'widespread', 'confident', 'straight', 'catholic', 'proud', 'numerous', 'opposite', 'distinct', 'mad', 'helpful', 'given', 'disabled', 'consistent', 'anxious', 'nervous', 'awful', 'stable', 'constitutional', 'satisfied', 'conscious', 'developing', 'strategic', 'holy', 'smooth', 'dominant', 'remote', 'theoretical', 'outstanding', 'pink', 'pretty', 'clinical', 'minimum', 'honest', 'impressive', 'related', 'residential', 'extraordinary', 'plain', 'visible', 'accurate', 'distant', 'still', 'greek', 'complicated', 'musical', 'precise', 'gentle', 'broken', 'live', 'silly', 'fat', 'tight', 'monetary', 'round', 'psychological', 'violent', 'unemployed', 'inevitable', 'junior', 'sensible', 'grateful', 'pleasant', 'dirty', 'structural', 'welcome', 'deaf', 'above', 'continuous', 'blind', 'overseas', 'mean', 'entitled', 'delighted', 'loose', 'occasional', 'evident', 'desperate', 'fellow', 'universal', 'square', 'steady', 'classic', 'equivalent', 'intellectual', 'victorian', 'level', 'ultimate', 'creative', 'lost', 'medieval', 'clever', 'linguistic', 'convinced', 'judicial', 'raw', 'sophisticated', 'asleep', 'vulnerable', 'illegal', 'outer', 'revolutionary', 'bitter', 'changing', 'australian', 'native', 'imperial', 'strict', 'wise', 'informal', 'flexible', 'collective', 'frequent', 'experimental', 'spiritual', 'intense', 'rational', 'ethnic', 'generous', 'inadequate', 'prominent', 'logical', 'bare', 'historic', 'modest', 'dutch', 'acute', 'electrical', 'valid', 'weekly', 'gross', 'automatic', 'loud', 'reliable', 'mutual', 'liable', 'multiple', 'ruling', 'curious', 'arab', 'sole', 'jewish', 'managing', 'pregnant', 'latin', 'nearby', 'exact', 'underlying', 'identical', 'satisfactory', 'marginal', 'distinctive', 'electoral', 'urgent', 'presidential', 'controversial', 'oral', 'everyday', 'encouraging', 'organic', 'continued', 'expected', 'statistical', 'desirable', 'innocent', 'improved', 'exclusive', 'marked', 'experienced', 'unexpected', 'superb', 'sheer', 'disappointed', 'frightened', 'gastric', 'capitalist', 'romantic', 'naked', 'reluctant', 'magnificent', 'convenient', 'established', 'closed', 'uncertain', 'artificial', 'diplomatic', 'tremendous', 'marine', 'mechanical', 'retail', 'institutional', 'mixed', 'required', 'biological', 'known', 'functional', 'straightforward', 'superior', 'digital', 'spectacular', 'unhappy', 'confused', 'unfair', 'aggressive', 'spare', 'painful', 'abstract', 'asian', 'associated', 'legislative', 'monthly', 'intelligent', 'hungry', 'explicit', 'nasty', 'just', 'faint', 'coloured', 'ridiculous', 'amazing', 'comparable', 'successive', 'realistic', 'back', 'decent', 'unnecessary', 'flying', 'fucking', 'random', 'influential', 'dull', 'genetic', 'neat', 'marvellous', 'crazy', 'damp', 'giant', 'secure', 'bottom', 'skilled', 'subtle', 'elegant', 'brave', 'lesser', 'parallel', 'steep', 'intensive', 'casual', 'tropical', 'lonely', 'partial', 'preliminary', 'concrete', 'alleged', 'assistant', 'vertical', 'upset', 'delicate', 'mild', 'occupational', 'excessive', 'progressive', 'iraqi', 'exceptional', 'integrated', 'striking', 'continental', 'okay', 'harsh', 'combined', 'fierce', 'handsome', 'characteristic', 'chronic', 'compulsory', 'interim', 'objective', 'splendid', 'magic', 'systematic', 'obliged', 'payable', 'fun', 'horrible', 'primitive', 'fascinating', 'ideological', 'metropolitan', 'surrounding', 'estimated', 'peaceful', 'premier', 'operational', 'technological', 'kind', 'advisory', 'hostile', 'precious', 'gay', 'accessible', 'determined', 'excited', 'impressed', 'provincial', 'smart', 'endless', 'isolated', 'drunk', 'geographical', 'like', 'dynamic', 'boring', 'forthcoming', 'unfortunate', 'definite', 'super', 'notable', 'indirect', 'stiff', 'wealthy', 'awkward', 'lively', 'neutral', 'artistic', 'content', 'mature', 'colonial', 'ambitious', 'evil', 'magnetic', 'verbal', 'legitimate', 'sympathetic', 'empirical', 'head', 'shallow', 'vague', 'naval', 'depressed', 'shared', 'added', 'shocked', 'mid', 'worthwhile', 'qualified', 'missing', 'blank', 'absent', 'favourable', 'polish', 'israeli', 'developed', 'profound', 'representative', 'enthusiastic', 'dreadful', 'rigid', 'reduced', 'cruel', 'coastal', 'peculiar', 'racial', 'ugly', 'swiss', 'crude', 'extended', 'selected', 'eager', 'feminist', 'canadian', 'bold', 'relaxed', 'corresponding', 'running', 'planned', 'applicable', 'immense', 'allied', 'comparative', 'uncomfortable', 'conservation', 'productive', 'beneficial', 'bored', 'charming', 'minimal', 'mobile', 'turkish', 'orange', 'rear', 'passive', 'suspicious', 'overwhelming', 'fatal', 'resulting', 'symbolic', 'registered', 'neighbouring', 'calm', 'irrelevant', 'patient', 'compact', 'profitable', 'rival', 'loyal', 'moderate', 'distinguished', 'interior', 'noble', 'insufficient', 'eligible', 'mysterious', 'varying', 'managerial', 'molecular', 'olympic', 'linear', 'prospective', 'printed', 'parental', 'diverse', 'elaborate', 'furious', 'fiscal', 'burning', 'useless', 'semantic', 'embarrassed', 'inherent', 'philosophical', 'deliberate', 'awake', 'variable', 'promising', 'unpleasant', 'varied', 'sacred', 'selective', 'inclined', 'tender', 'hidden', 'worthy', 'intermediate', 'sound', 'protective', 'fortunate', 'slim', 'islamic', 'defensive', 'divine', 'stuck', 'driving', 'invisible', 'misleading', 'circular', 'mathematical', 'inappropriate', 'liquid', 'persistent', 'solar', 'doubtful', 'manual', 'architectural', 'intact', 'incredible', 'devoted', 'prior', 'tragic', 'respectable', 'optimistic', 'convincing', 'unacceptable', 'decisive', 'competent', 'spatial', 'respective', 'binding', 'relieved', 'nursing', 'toxic', 'select', 'redundant', 'integral', 'then', 'probable', 'amateur', 'fond', 'passing', 'specified', 'territorial', 'horizontal', 'inland', 'cognitive', 'regulatory', 'miserable', 'resident', 'polite', 'scared', 'marxist', 'gothic', 'civilian', 'instant', 'lengthy', 'adverse', 'korean', 'unconscious', 'anonymous', 'aesthetic', 'orthodox', 'static', 'unaware', 'costly', 'fantastic', 'foolish', 'fashionable', 'causal', 'compatible', 'wee', 'implicit', 'dual', 'ok', 'cheerful', 'subjective', 'forward', 'surviving', 'exotic', 'purple', 'cautious', 'visiting', 'aggregate', 'ethical', 'protestant', 'teenage', 'dying', 'disastrous', 'delicious', 'confidential', 'underground', 'thorough', 'grim', 'autonomous', 'atomic', 'frozen', 'colourful', 'injured', 'uniform', 'ashamed', 'glorious', 'wicked', 'coherent', 'rising', 'shy', 'novel', 'balanced', 'delightful', 'arbitrary', 'adjacent', 'psychiatric', 'worrying', 'weird', 'unchanged', 'rolling', 'evolutionary', 'intimate', 'sporting', 'disciplinary', 'formidable', 'lexical', 'noisy', 'gradual', 'accused', 'homeless', 'supporting', 'coming', 'renewed', 'excess', 'retired', 'rubber', 'chosen', 'outdoor', 'embarrassing', 'preferred', 'bizarre', 'appalling', 'agreed', 'imaginative', 'governing', 'accepted', 'vocational', 'palestinian', 'mighty', 'puzzled', 'worldwide', 'handicapped', 'organisational', 'sunny', 'eldest', 'eventual', 'spontaneous', 'vivid', 'rude', 'faithful', 'ministerial', 'innovative', 'controlled', 'conceptual', 'unwilling', 'civic', 'meaningful', 'disturbing', 'alive', 'brainy', 'breakable', 'busy', 'careful', 'cautious', 'clever', 'concerned', 'crazy', 'curious', 'dead', 'different', 'difficult', 'doubtful', 'easy', 'famous', 'fragile', 'helpful', 'helpless', 'important', 'impossible', 'innocent', 'inquisitive', 'modern', 'open', 'outstanding', 'poor', 'powerful', 'puzzled', 'real', 'rich', 'shy', 'sleepy', 'stupid', 'super', 'tame', 'uninterested', 'wandering', 'wild', 'wrong', 'adorable', 'alert', 'average', 'beautiful', 'blonde', 'bloody', 'blushing', 'bright', 'clean', 'clear', 'cloudy', 'colorful', 'crowded', 'cute', 'dark', 'drab', 'distinct', 'dull', 'elegant', 'fancy', 'filthy', 'glamorous', 'gleaming', 'graceful', 'grotesque', 'homely', 'light', 'misty', 'motionless', 'muddy', 'plain', 'poised', 'quaint', 'shiny', 'smoggy', 'sparkling', 'spotless', 'stormy', 'strange', 'ugly', 'unsightly', 'unusual', 'bad', 'better', 'beautiful', 'big', 'black', 'blue', 'bright', 'clumsy', 'crazy', 'dizzy', 'dull', 'fat', 'frail', 'friendly', 'funny', 'great', 'green', 'gigantic', 'gorgeous', 'grumpy', 'handsome', 'happy', 'horrible', 'itchy', 'jittery', 'jolly', 'kind', 'long', 'lazy', 'magnificent', 'magenta', 'many', 'mighty', 'mushy', 'nasty', 'new', 'nice', 'nosy', 'nutty', 'nutritious', 'odd', 'orange', 'ordinary', 'pretty', 'precious', 'prickly', 'purple', 'quaint', 'quiet', 'quick', 'quickest', 'rainy', 'rare', 'ratty', 'red', 'roasted', 'robust', 'round', 'sad', 'scary', 'scrawny', 'short', 'silly', 'stingy', 'strange', 'striped', 'spotty', 'tart', 'tall', 'tame', 'tan', 'tender', 'testy', 'tricky', 'tough', 'ugly', 'ugliest', 'vast', 'watery', 'wasteful', 'wonderful', 'yellow', 'yummy', 'zany'];
},{}],"TAQU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ['amaranth', 'amber', 'amethyst', 'apricot', 'aqua', 'aquamarine', 'azure', 'beige', 'black', 'blue', 'blush', 'bronze', 'brown', 'chocolate', 'coffee', 'copper', 'coral', 'crimson', 'cyan', 'emerald', 'fuchsia', 'gold', 'gray', 'green', 'harlequin', 'indigo', 'ivory', 'jade', 'lavender', 'lime', 'magenta', 'maroon', 'moccasin', 'olive', 'orange', 'peach', 'pink', 'plum', 'purple', 'red', 'rose', 'salmon', 'sapphire', 'scarlet', 'silver', 'tan', 'teal', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
},{}],"ch1d":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ['canidae', 'felidae', 'cat', 'cattle', 'dog', 'donkey', 'goat', 'horse', 'pig', 'rabbit', 'aardvark', 'aardwolf', 'albatross', 'alligator', 'alpaca', 'amphibian', 'anaconda', 'angelfish', 'anglerfish', 'ant', 'anteater', 'antelope', 'antlion', 'ape', 'aphid', 'armadillo', 'asp', 'baboon', 'badger', 'bandicoot', 'barnacle', 'barracuda', 'basilisk', 'bass', 'bat', 'bear', 'beaver', 'bedbug', 'bee', 'beetle', 'bird', 'bison', 'blackbird', 'boa', 'boar', 'bobcat', 'bobolink', 'bonobo', 'booby', 'bovid', 'bug', 'butterfly', 'buzzard', 'camel', 'canid', 'capybara', 'cardinal', 'caribou', 'carp', 'cat', 'catshark', 'caterpillar', 'catfish', 'cattle', 'centipede', 'cephalopod', 'chameleon', 'cheetah', 'chickadee', 'chicken', 'chimpanzee', 'chinchilla', 'chipmunk', 'clam', 'clownfish', 'cobra', 'cockroach', 'cod', 'condor', 'constrictor', 'coral', 'cougar', 'cow', 'coyote', 'crab', 'crane', 'crawdad', 'crayfish', 'cricket', 'crocodile', 'crow', 'cuckoo', 'cicada', 'damselfly', 'deer', 'dingo', 'dinosaur', 'dog', 'dolphin', 'donkey', 'dormouse', 'dove', 'dragonfly', 'dragon', 'duck', 'eagle', 'earthworm', 'earwig', 'echidna', 'eel', 'egret', 'elephant', 'elk', 'emu', 'ermine', 'falcon', 'ferret', 'finch', 'firefly', 'fish', 'flamingo', 'flea', 'fly', 'flyingfish', 'fowl', 'fox', 'frog', 'gamefowl', 'galliform', 'gazelle', 'gecko', 'gerbil', 'gibbon', 'giraffe', 'goat', 'goldfish', 'goose', 'gopher', 'gorilla', 'grasshopper', 'grouse', 'guan', 'guanaco', 'guineafowl', 'gull', 'guppy', 'haddock', 'halibut', 'hamster', 'hare', 'harrier', 'hawk', 'hedgehog', 'heron', 'herring', 'hippopotamus', 'hookworm', 'hornet', 'horse', 'hoverfly', 'hummingbird', 'hyena', 'iguana', 'impala', 'jackal', 'jaguar', 'jay', 'jellyfish', 'junglefowl', 'kangaroo', 'kingfisher', 'kite', 'kiwi', 'koala', 'koi', 'krill', 'ladybug', 'lamprey', 'landfowl', 'lark', 'leech', 'lemming', 'lemur', 'leopard', 'leopon', 'limpet', 'lion', 'lizard', 'llama', 'lobster', 'locust', 'loon', 'louse', 'lungfish', 'lynx', 'macaw', 'mackerel', 'magpie', 'mammal', 'manatee', 'mandrill', 'marlin', 'marmoset', 'marmot', 'marsupial', 'marten', 'mastodon', 'meadowlark', 'meerkat', 'mink', 'minnow', 'mite', 'mockingbird', 'mole', 'mollusk', 'mongoose', 'monkey', 'moose', 'mosquito', 'moth', 'mouse', 'mule', 'muskox', 'narwhal', 'newt', 'nightingale', 'ocelot', 'octopus', 'opossum', 'orangutan', 'orca', 'ostrich', 'otter', 'owl', 'ox', 'panda', 'panther', 'parakeet', 'parrot', 'parrotfish', 'partridge', 'peacock', 'peafowl', 'pelican', 'penguin', 'perch', 'pheasant', 'pig', 'pigeon', 'pike', 'pinniped', 'piranha', 'planarian', 'platypus', 'pony', 'porcupine', 'porpoise', 'possum', 'prawn', 'primate', 'ptarmigan', 'puffin', 'puma', 'python', 'quail', 'quelea', 'quokka', 'rabbit', 'raccoon', 'rat', 'rattlesnake', 'raven', 'reindeer', 'reptile', 'rhinoceros', 'roadrunner', 'rodent', 'rook', 'rooster', 'roundworm', 'sailfish', 'salamander', 'salmon', 'sawfish', 'scallop', 'scorpion', 'seahorse', 'shark', 'sheep', 'shrew', 'shrimp', 'silkworm', 'silverfish', 'skink', 'skunk', 'sloth', 'slug', 'smelt', 'snail', 'snake', 'snipe', 'sole', 'sparrow', 'spider', 'spoonbill', 'squid', 'squirrel', 'starfish', 'stingray', 'stoat', 'stork', 'sturgeon', 'swallow', 'swan', 'swift', 'swordfish', 'swordtail', 'tahr', 'takin', 'tapir', 'tarantula', 'tarsier', 'termite', 'tern', 'thrush', 'tick', 'tiger', 'tiglon', 'toad', 'tortoise', 'toucan', 'trout', 'tuna', 'turkey', 'turtle', 'tyrannosaurus', 'urial', 'vicuna', 'viper', 'vole', 'vulture', 'wallaby', 'walrus', 'wasp', 'warbler', 'weasel', 'whale', 'whippet', 'whitefish', 'wildcat', 'wildebeest', 'wildfowl', 'wolf', 'wolverine', 'wombat', 'woodpecker', 'worm', 'wren', 'xerinae', 'yak', 'zebra', 'alpaca', 'cat', 'cattle', 'chicken', 'dog', 'donkey', 'ferret', 'gayal', 'goldfish', 'guppy', 'horse', 'koi', 'llama', 'sheep', 'yak'];
},{}],"m78u":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var UniqueNamesGenerator = function () {
  function UniqueNamesGenerator(config) {
    var length = config.length,
        separator = config.separator,
        dictionaries = config.dictionaries;
    this.dictionaries = dictionaries;
    this.separator = separator;
    this.length = length;
  }

  UniqueNamesGenerator.prototype.generate = function () {
    var _this = this;

    if (!this.dictionaries) {
      throw new Error('Cannot find any dictionary. Please provide at least one, or leave ' + 'the "dictionary" field empty in the config object');
    }

    if (this.length <= 0) {
      throw new Error('Invalid length provided');
    }

    if (this.length > this.dictionaries.length) {
      throw new Error('The length cannot be bigger than the number of dictionaries.\n' + ("Length provided: " + this.length + ". Number of dictionaries provided: " + this.dictionaries.length));
    }

    return this.dictionaries.slice(0, this.length).reduce(function (acc, curr) {
      var rnd = Math.floor(Math.random() * curr.length);
      var word = curr[rnd];
      return acc ? "" + acc + _this.separator + word : "" + word;
    }, '');
  };

  return UniqueNamesGenerator;
}();

exports.UniqueNamesGenerator = UniqueNamesGenerator;
},{}],"oOYt":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var adjectives_1 = __importDefault(require("./dictionaries/adjectives"));

var colors_1 = __importDefault(require("./dictionaries/colors"));

var animals_1 = __importDefault(require("./dictionaries/animals"));

var unique_names_generator_1 = require("./unique-names-generator");

var defaultConfig = {
  separator: '_',
  length: 3,
  dictionaries: [adjectives_1.default, colors_1.default, animals_1.default]
};

exports.uniqueNamesGenerator = function (customConfig) {
  if (customConfig === void 0) {
    customConfig = {};
  }

  var config = __assign({}, defaultConfig, customConfig, {
    dictionaries: (customConfig && customConfig.dictionaries || defaultConfig.dictionaries).slice()
  });

  var ung = new unique_names_generator_1.UniqueNamesGenerator(config);
  return ung.generate();
};
},{"./dictionaries/adjectives":"8fxs","./dictionaries/colors":"TAQU","./dictionaries/animals":"ch1d","./unique-names-generator":"m78u"}],"LC55":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var adjectives_1 = __importDefault(require("./adjectives"));

exports.adjectives = adjectives_1.default;

var animals_1 = __importDefault(require("./animals"));

exports.animals = animals_1.default;

var colors_1 = __importDefault(require("./colors"));

exports.colors = colors_1.default;
},{"./adjectives":"8fxs","./animals":"ch1d","./colors":"TAQU"}],"Qz33":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./lib/index"));

__export(require("./lib/dictionaries/index"));
},{"./lib/index":"oOYt","./lib/dictionaries/index":"LC55"}],"EjGt":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

function logEvent() {
  var isDebug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var message = arguments.length > 1 ? arguments[1] : undefined;
  var data = arguments.length > 2 ? arguments[2] : undefined;
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'info';

  if (isDebug && window.console) {
    var color = '';

    if (type === 'error') {
      color = '#EB3223';
    } else if (type === 'event') {
      color = /_ERROR$/i.test(message) ? '#eba4a7' : '#5ee9eb';
    }

    var messageConsoleStyles = "\n       font-weight: bold;\n       color: ".concat(color, ";\n    ");
    var infoButtonConsoleStyles = "\n      font-weight: normal;\n      text-decoration: underline;\n      color: ".concat(color, ";\n    ");
    var arrowConsoleStyles = "\n      font: 10px Arial;\n      padding-left: 3px;\n      color: ".concat(color, ";\n    ");
    var additionalDataConsoleStyles = "font-weight: bold;";
    console.groupCollapsed("%cElixirChat: ".concat(message, " %cInfo%c\u25BE"), messageConsoleStyles, infoButtonConsoleStyles, arrowConsoleStyles);

    if (type === 'error') {
      console.error(data);
    } else if (data && _typeof(data) === 'object' && !(data instanceof Array)) {
      Object.keys(data).forEach(function (key) {
        console.log("%c".concat(key, ":\n"), additionalDataConsoleStyles, data[key], '\n');
      });
    } else {
      console.log('%c\nData:\n', additionalDataConsoleStyles, data);
    }

    console.log('%c\nStacktrace:', additionalDataConsoleStyles);
    console.trace();
    console.groupEnd();
  }
}

exports.logEvent = logEvent;

function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

exports.capitalize = capitalize;

function randomDigitStringId(idLength) {
  return (Array(idLength).join('0') + Math.random()).slice(-idLength);
}

exports.randomDigitStringId = randomDigitStringId; // Lodash-like _.get

function _get(object, path, defaultValue) {
  var prefix = /^\[/i.test(path) ? 'object' : 'object.';

  try {
    return eval(prefix + path);
  } catch (e) {
    return defaultValue;
  }
}

exports._get = _get; // Lodash-like _.merge

function _merge(object1, object2) {
  var mergedObject = {};

  for (var a in object1) {
    mergedObject[a] = object1[a];
  }

  for (var b in object2) {
    if (object2[b]) {
      mergedObject[b] = object2[b];
    }
  }

  return mergedObject;
}

exports._merge = _merge; // Lodash-like _.last

function _last(arr) {
  return arr[arr.length - 1];
}

exports._last = _last; // Lodash-like _.round

function _round(num) {
  return +num.toFixed(2);
}

exports._round = _round; // Lodash-like _.flatten

function _flatten(arr) {
  var flattenedArray = [];

  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];

    if (item instanceof Array) {
      flattenedArray = flattenedArray.concat(item);
    } else {
      flattenedArray.push(item);
    }
  }

  return flattenedArray;
}

exports._flatten = _flatten;

function detectPlatform() {
  return {
    isWindows: navigator.platform.indexOf('Win') > -1,
    isMac: navigator.platform.indexOf('Mac') > -1
  };
}

exports.detectPlatform = detectPlatform;

function getJSONFromLocalStorage(key) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var value = defaultValue;

  try {
    value = JSON.parse(localStorage.getItem(key));
  } catch (e) {}

  return value;
}

exports.getJSONFromLocalStorage = getJSONFromLocalStorage;

function isWebImage(mimeType) {
  return ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(mimeType.toLowerCase());
}

exports.isWebImage = isWebImage;
},{}],"1fv+":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GraphQLClient =
/*#__PURE__*/
function () {
  function GraphQLClient(_ref) {
    var url = _ref.url,
        token = _ref.token;

    _classCallCheck(this, GraphQLClient);

    this.headers = {
      'Accept': 'application/json'
    };
    this.url = url;
    this.token = token;

    if (this.token) {
      this.headers.Authorization = "Bearer ".concat(this.token);
    }
  }

  _createClass(GraphQLClient, [{
    key: "makeFormData",
    value: function makeFormData(query, variables, binaryFiles) {
      var formData = new FormData();
      formData.append('query', query);
      formData.append('variables', JSON.stringify(variables));

      for (var fileName in binaryFiles) {
        formData.append(fileName, binaryFiles[fileName]);
      }

      return formData;
    }
  }, {
    key: "query",
    value: function query(_query, variables, binaryFiles) {
      var _this = this;

      var headers;
      var body;

      if (binaryFiles) {
        body = this.makeFormData(_query, variables, binaryFiles);
        headers = this.headers;
      } else {
        body = JSON.stringify({
          query: _query,
          variables: variables
        });
        headers = Object.assign({}, this.headers, {
          'Content-Type': 'application/json'
        });
      }

      return new Promise(function (resolve, reject) {
        fetch(_this.url, {
          method: 'POST',
          headers: headers,
          body: body
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.errors) {
            reject(response);
          } else {
            resolve(response.data);
          }
        }).catch(function (response) {
          return reject(response);
        });
      });
    }
  }]);

  return GraphQLClient;
}();

exports.GraphQLClient = GraphQLClient;

exports.simplifyGraphQLJSON = function (graphQLJSON) {
  return graphQLJSON.edges.map(function (data) {
    return Object.assign({}, data.node, {
      cursor: data.cursor
    });
  });
};

exports.gql = function (queryParts) {
  var str = '';

  for (var i = 0; i < queryParts.length; i++) {
    str += queryParts[i] + ((i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1]) || '');
  }

  return str;
};

exports.insertGraphQlFragments = function (query) {
  var fragments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fragmentsString = '';

  for (var name in fragments) {
    fragmentsString += fragments[name];
  }

  return query + fragmentsString;
};
},{}],"1lqy":[function(require,module,exports) {
"use strict";

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  fragment fragmentCompanyEmployee on CompanyEmployee {\n    employee {\n      id\n      firstName\n      lastName\n    }\n    __typename\n    isWorking\n    role\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  fragment fragmentClient on Client {\n    __typename\n    id\n    foreignId\n    firstName\n    lastName\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GraphQLClient_1 = require("../GraphQLClient");

var utilsCommon_1 = require("../../utilsCommon");

exports.fragmentClient = GraphQLClient_1.gql(_templateObject());
exports.fragmentCompanyEmployee = GraphQLClient_1.gql(_templateObject2());

function serializeUser(user, elixirChat) {
  var elixirChatId = utilsCommon_1._get(user, 'foreignId') || null;
  var isOperator = utilsCommon_1._get(user, '__typename') !== 'Client';
  var id = isOperator ? utilsCommon_1._get(user, 'employee.id') : utilsCommon_1._get(user, 'id');
  return {
    id: id || null,
    firstName: utilsCommon_1._get(user, 'firstName') || utilsCommon_1._get(user, 'employee.firstName') || '',
    lastName: utilsCommon_1._get(user, 'lastName') || utilsCommon_1._get(user, 'employee.lastName') || '',
    isCurrentClient: elixirChatId === elixirChat.client.id,
    isOperator: isOperator,
    elixirChatId: elixirChatId
  };
}

exports.serializeUser = serializeUser;
},{"../GraphQLClient":"1fv+","../../utilsCommon":"EjGt"}],"zWqG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WIDGET_IFRAME_READY = 'WIDGET_IFRAME_READY';
exports.WIDGET_RENDERED = 'WIDGET_RENDERED';
exports.WIDGET_POPUP_OPEN = 'WIDGET_POPUP_OPEN';
exports.WIDGET_POPUP_CLOSE = 'WIDGET_POPUP_CLOSE';
exports.WIDGET_POPUP_TOGGLE = 'WIDGET_POPUP_TOGGLE';
exports.WIDGET_POPUP_FOCUS = 'WIDGET_POPUP_FOCUS';
exports.WIDGET_POPUP_BLUR = 'WIDGET_POPUP_BLUR';
exports.WIDGET_MUTE = 'WIDGET_MUTE';
exports.WIDGET_UNMUTE = 'WIDGET_UNMUTE';
exports.SCREENSHOT_REQUEST_SUCCESS = 'SCREENSHOT_REQUEST_SUCCESS';
exports.SCREENSHOT_REQUEST_ERROR = 'SCREENSHOT_REQUEST_ERROR';
exports.REPLY_MESSAGE = 'REPLY_MESSAGE';
exports.TEXTAREA_VERTICAL_RESIZE = 'TEXTAREA_VERTICAL_RESIZE';
exports.IMAGE_PREVIEW_OPEN = 'IMAGE_PREVIEW_OPEN';
exports.IMAGE_PREVIEW_CLOSE = 'IMAGE_PREVIEW_CLOSE';
},{}],"CLsL":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var utilsCommon_1 = require("../utilsCommon");

var ElixirChatWidgetEventTypes_1 = require("../widget/ElixirChatWidgetEventTypes");

var ScreenshotTaker =
/*#__PURE__*/
function () {
  function ScreenshotTaker(_ref) {
    var _this = this;

    var elixirChat = _ref.elixirChat;

    _classCallCheck(this, ScreenshotTaker);

    this.mediaOptions = {
      video: {
        width: screen.width * window.devicePixelRatio,
        height: screen.height * window.devicePixelRatio
      }
    };
    this.width = 0;
    this.height = 0;

    this.takeScreenshot = function () {
      var _this$elixirChat = _this.elixirChat,
          debug = _this$elixirChat.debug,
          triggerEvent = _this$elixirChat.triggerEvent;
      return new Promise(function (resolve, reject) {
        _this.getMediaStream().then(function (stream) {
          _this.stream = stream;
          _this.video.srcObject = _this.stream;

          _this.video.oncanplay = function () {
            _this.setVideoCanvasSize();

            setTimeout(function () {
              var screenshot = _this.captureVideoFrame();

              _this.stopMediaStream();

              utilsCommon_1.logEvent(debug, 'Captured screenshot', screenshot);
              triggerEvent(ElixirChatWidgetEventTypes_1.SCREENSHOT_REQUEST_SUCCESS, screenshot);
              resolve(screenshot);
            }, 500);
          };

          _this.video.play();
        }).catch(function (error) {
          utilsCommon_1.logEvent(debug, 'Could not capture screenshot', error, 'error');
          triggerEvent(ElixirChatWidgetEventTypes_1.SCREENSHOT_REQUEST_ERROR, error);
          reject(error);
        });
      });
    };

    this.elixirChat = elixirChat;
    this.initialize();
  }

  _createClass(ScreenshotTaker, [{
    key: "initialize",
    value: function initialize() {
      this.width = screen.width * window.devicePixelRatio;
      this.canvas = document.createElement('canvas');
      this.video = document.createElement('video');
    }
  }, {
    key: "setVideoCanvasSize",
    value: function setVideoCanvasSize() {
      var video = this.video,
          canvas = this.canvas,
          width = this.width;
      this.height = video.videoHeight / (video.videoWidth / width);
      video.width = width;
      video.height = this.height;
      canvas.width = width;
      canvas.height = this.height;
    }
  }, {
    key: "captureVideoFrame",
    value: function captureVideoFrame() {
      var canvas = this.canvas,
          width = this.width,
          height = this.height,
          video = this.video;
      var context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, width, height);
      var dataUrl = canvas.toDataURL('image/png');
      var file = this.base64ToFile(dataUrl);
      return {
        dataUrl: dataUrl,
        file: file
      };
    }
  }, {
    key: "stopMediaStream",
    value: function stopMediaStream() {
      this.stream.getTracks()[0].stop();
    }
  }, {
    key: "getMediaStream",
    value: function getMediaStream() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          var mediaDevices = navigator.mediaDevices;
          mediaDevices.getDisplayMedia(_this2.mediaOptions).then(resolve).catch(reject);
        } catch (e) {
          reject({
            message: 'MediaDevices.getDisplayMedia is not supported in this browser'
          });
        }
      });
    }
  }, {
    key: "base64ToFile",
    value: function base64ToFile(dataUrl) {
      var blobBin = atob(dataUrl.split(',')[1]);
      var blobArray = [];

      for (var i = 0; i < blobBin.length; i++) {
        blobArray.push(blobBin.charCodeAt(i));
      }

      var blob = new Blob([new Uint8Array(blobArray)]);
      var fileName = "Screenshot ".concat(new Date().toLocaleString(), ".png");
      return new File([blob], fileName, {
        type: 'image/png'
      });
    }
  }]);

  return ScreenshotTaker;
}();

exports.ScreenshotTaker = ScreenshotTaker;

exports.getScreenshotCompatibilityFallback = function () {
  var getDisplayMedia;

  try {
    getDisplayMedia = navigator.mediaDevices.getDisplayMedia;
  } catch (e) {}

  if (getDisplayMedia) {
    return null;
  } else {
    var platform = utilsCommon_1.detectPlatform();

    if (platform.isMac) {
      return {
        pressKey: 'Cmd+Control+Shift+3'
      };
    } else if (platform.isWindows) {
      return {
        pressKey: 'PrtSc',
        pressKeySecondary: 'Fn+PrtSc'
      };
    } else {
      return {
        pressKey: null
      };
    }
  }
};
},{"../utilsCommon":"EjGt","../widget/ElixirChatWidgetEventTypes":"zWqG"}],"5qf4":[function(require,module,exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],"ss9A":[function(require,module,exports) {
var core = module.exports = { version: '2.6.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],"M7z6":[function(require,module,exports) {
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],"eT53":[function(require,module,exports) {
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":"M7z6"}],"5BXi":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],"P9Ib":[function(require,module,exports) {
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":"5BXi"}],"/vZ6":[function(require,module,exports) {
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_is-object":"M7z6","./_global":"5qf4"}],"/o6G":[function(require,module,exports) {
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":"P9Ib","./_fails":"5BXi","./_dom-create":"/vZ6"}],"9y37":[function(require,module,exports) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":"M7z6"}],"nw8e":[function(require,module,exports) {
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":"eT53","./_ie8-dom-define":"/o6G","./_to-primitive":"9y37","./_descriptors":"P9Ib"}],"uJ6d":[function(require,module,exports) {
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],"0NXb":[function(require,module,exports) {
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_object-dp":"nw8e","./_property-desc":"uJ6d","./_descriptors":"P9Ib"}],"2uHg":[function(require,module,exports) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],"U49f":[function(require,module,exports) {
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],"PHot":[function(require,module,exports) {

var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_global":"5qf4","./_hide":"0NXb","./_has":"2uHg","./_uid":"U49f","./_core":"ss9A"}],"6kYj":[function(require,module,exports) {
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],"E3Kh":[function(require,module,exports) {
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":"6kYj"}],"izCb":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_global":"5qf4","./_core":"ss9A","./_hide":"0NXb","./_redefine":"PHot","./_ctx":"E3Kh"}],"Z5df":[function(require,module,exports) {
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],"nGau":[function(require,module,exports) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":"Z5df"}],"+Bjj":[function(require,module,exports) {
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],"rfVX":[function(require,module,exports) {
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":"+Bjj"}],"yjVO":[function(require,module,exports) {
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],"dJBs":[function(require,module,exports) {
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":"yjVO"}],"JTrm":[function(require,module,exports) {
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":"Z5df"}],"H21C":[function(require,module,exports) {
module.exports = false;

},{}],"6zGc":[function(require,module,exports) {

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":"ss9A","./_global":"5qf4","./_library":"H21C"}],"44AI":[function(require,module,exports) {
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_shared":"6zGc","./_uid":"U49f","./_global":"5qf4"}],"NNbH":[function(require,module,exports) {
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-object":"M7z6","./_is-array":"JTrm","./_wks":"44AI"}],"igas":[function(require,module,exports) {
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":"NNbH"}],"AuPh":[function(require,module,exports) {
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_ctx":"E3Kh","./_iobject":"nGau","./_to-object":"rfVX","./_to-length":"dJBs","./_array-species-create":"igas"}],"Z7e/":[function(require,module,exports) {
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_wks":"44AI","./_hide":"0NXb"}],"7sVm":[function(require,module,exports) {
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_export":"izCb","./_array-methods":"AuPh","./_add-to-unscopables":"Z7e/"}],"Qppk":[function(require,module,exports) {
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_export":"izCb","./_array-methods":"AuPh","./_add-to-unscopables":"Z7e/"}],"N3yi":[function(require,module,exports) {
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_object-dp":"nw8e","./_descriptors":"P9Ib"}],"EIvU":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

exports.default = function (innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
};
},{}],"o7wy":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flip = flip;
exports.constant = constant;
exports.on = on;
exports.compose = compose;
exports.pipe = pipe;
exports.curry = curry;
// eslint-disable-line no-redeclare

// Flips the order of the arguments to a function of two arguments.
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare

// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare

// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
function flip(f) {
  return function (b, a) {
    return f(a, b);
  };
}

// Returns its first argument and ignores its second.
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare

function constant(a) {
  return function () {
    return a;
  };
}

// The `on` function is used to change the domain of a binary operator.
function on(o, f) {
  return function (x, y) {
    return o(f(x), f(y));
  };
}

function compose() {
  var _this = this;

  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  // eslint-disable-line no-redeclare
  var len = fns.length - 1;
  return function (x) {
    var y = x;
    for (var _i = len; _i > -1; _i--) {
      y = fns[_i].call(_this, y);
    }
    return y;
  };
}

function pipe() {
  var _this2 = this;

  for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  // eslint-disable-line no-redeclare
  var len = fns.length - 1;
  return function (x) {
    var y = x;
    for (var _i2 = 0; _i2 <= len; _i2++) {
      y = fns[_i2].call(_this2, y);
    }
    return y;
  };
}

function curried(f, length, acc) {
  return function () {
    var combined = acc.concat(Array.prototype.slice.call(arguments));
    return combined.length >= length ? f.apply(this, combined) : curried(f, length, combined);
  };
}

function curry(f) {
  // eslint-disable-line no-redeclare
  return curried(f, f.length, []);
}
},{}],"lytE":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_to-integer":"yjVO","./_defined":"+Bjj"}],"1kq3":[function(require,module,exports) {
module.exports = true;

},{}],"3zRh":[function(require,module,exports) {
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":"6kYj"}],"zotD":[function(require,module,exports) {
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":"M7z6"}],"6MLN":[function(require,module,exports) {
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":"5BXi"}],"9kxq":[function(require,module,exports) {
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_is-object":"M7z6","./_global":"5qf4"}],"R6c1":[function(require,module,exports) {
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":"6MLN","./_fails":"5BXi","./_dom-create":"9kxq"}],"EKwp":[function(require,module,exports) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":"M7z6"}],"Gfzd":[function(require,module,exports) {
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":"zotD","./_ie8-dom-define":"R6c1","./_to-primitive":"EKwp","./_descriptors":"6MLN"}],"akPY":[function(require,module,exports) {
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_object-dp":"Gfzd","./_property-desc":"uJ6d","./_descriptors":"6MLN"}],"vSO4":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_global":"5qf4","./_core":"ss9A","./_ctx":"3zRh","./_hide":"akPY","./_has":"2uHg"}],"gojl":[function(require,module,exports) {
module.exports = require('./_hide');

},{"./_hide":"akPY"}],"dhak":[function(require,module,exports) {
module.exports = {};

},{}],"E5Ce":[function(require,module,exports) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":"Z5df"}],"Wyka":[function(require,module,exports) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_iobject":"E5Ce","./_defined":"+Bjj"}],"S7IM":[function(require,module,exports) {
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":"yjVO"}],"Zwq5":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":"yjVO"}],"LNnS":[function(require,module,exports) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-iobject":"Wyka","./_to-length":"S7IM","./_to-absolute-index":"Zwq5"}],"NB7d":[function(require,module,exports) {

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":"ss9A","./_global":"5qf4","./_library":"1kq3"}],"/wuY":[function(require,module,exports) {
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":"NB7d","./_uid":"U49f"}],"B9Lq":[function(require,module,exports) {
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_has":"2uHg","./_to-iobject":"Wyka","./_array-includes":"LNnS","./_shared-key":"/wuY"}],"KxjL":[function(require,module,exports) {
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],"knrM":[function(require,module,exports) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_object-keys-internal":"B9Lq","./_enum-bug-keys":"KxjL"}],"gjjs":[function(require,module,exports) {
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_object-dp":"Gfzd","./_an-object":"zotD","./_object-keys":"knrM","./_descriptors":"6MLN"}],"ebIA":[function(require,module,exports) {
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":"5qf4"}],"TNJq":[function(require,module,exports) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":"zotD","./_object-dps":"gjjs","./_enum-bug-keys":"KxjL","./_shared-key":"/wuY","./_dom-create":"9kxq","./_html":"ebIA"}],"Ug9I":[function(require,module,exports) {
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_shared":"NB7d","./_uid":"U49f","./_global":"5qf4"}],"11Ut":[function(require,module,exports) {
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_object-dp":"Gfzd","./_has":"2uHg","./_wks":"Ug9I"}],"b7Q2":[function(require,module,exports) {
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_object-create":"TNJq","./_property-desc":"uJ6d","./_set-to-string-tag":"11Ut","./_hide":"akPY","./_wks":"Ug9I"}],"mbLO":[function(require,module,exports) {
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":"+Bjj"}],"HHE0":[function(require,module,exports) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":"2uHg","./_to-object":"mbLO","./_shared-key":"/wuY"}],"uRfg":[function(require,module,exports) {
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_library":"1kq3","./_export":"vSO4","./_redefine":"gojl","./_hide":"akPY","./_iterators":"dhak","./_iter-create":"b7Q2","./_set-to-string-tag":"11Ut","./_object-gpo":"HHE0","./_wks":"Ug9I"}],"i+u+":[function(require,module,exports) {
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_string-at":"lytE","./_iter-define":"uRfg"}],"ID6i":[function(require,module,exports) {
module.exports = function () { /* empty */ };

},{}],"xwD+":[function(require,module,exports) {
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],"OYXR":[function(require,module,exports) {
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":"ID6i","./_iter-step":"xwD+","./_iterators":"dhak","./_to-iobject":"Wyka","./_iter-define":"uRfg"}],"COf8":[function(require,module,exports) {

require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./es6.array.iterator":"OYXR","./_global":"5qf4","./_hide":"akPY","./_iterators":"dhak","./_wks":"Ug9I"}],"ZxII":[function(require,module,exports) {
exports.f = require('./_wks');

},{"./_wks":"Ug9I"}],"nFDa":[function(require,module,exports) {
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');

},{"../../modules/es6.string.iterator":"i+u+","../../modules/web.dom.iterable":"COf8","../../modules/_wks-ext":"ZxII"}],"6t7t":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":"nFDa"}],"e8vu":[function(require,module,exports) {
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_uid":"U49f","./_is-object":"M7z6","./_has":"2uHg","./_object-dp":"Gfzd","./_fails":"5BXi"}],"c2zY":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_global":"5qf4","./_core":"ss9A","./_library":"1kq3","./_wks-ext":"ZxII","./_object-dp":"Gfzd"}],"Ocr3":[function(require,module,exports) {
exports.f = Object.getOwnPropertySymbols;

},{}],"z7R8":[function(require,module,exports) {
exports.f = {}.propertyIsEnumerable;

},{}],"ycyv":[function(require,module,exports) {
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-keys":"knrM","./_object-gops":"Ocr3","./_object-pie":"z7R8"}],"ayXv":[function(require,module,exports) {
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":"Z5df"}],"Ni5N":[function(require,module,exports) {
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_object-keys-internal":"B9Lq","./_enum-bug-keys":"KxjL"}],"rMkZ":[function(require,module,exports) {
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_to-iobject":"Wyka","./_object-gopn":"Ni5N"}],"sxPs":[function(require,module,exports) {
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_object-pie":"z7R8","./_property-desc":"uJ6d","./_to-iobject":"Wyka","./_to-primitive":"EKwp","./_has":"2uHg","./_ie8-dom-define":"R6c1","./_descriptors":"6MLN"}],"Aa2f":[function(require,module,exports) {

'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_global":"5qf4","./_has":"2uHg","./_descriptors":"6MLN","./_export":"vSO4","./_redefine":"gojl","./_meta":"e8vu","./_fails":"5BXi","./_shared":"NB7d","./_set-to-string-tag":"11Ut","./_uid":"U49f","./_wks":"Ug9I","./_wks-ext":"ZxII","./_wks-define":"c2zY","./_enum-keys":"ycyv","./_is-array":"ayXv","./_an-object":"zotD","./_is-object":"M7z6","./_to-iobject":"Wyka","./_to-primitive":"EKwp","./_property-desc":"uJ6d","./_object-create":"TNJq","./_object-gopn-ext":"rMkZ","./_object-gopd":"sxPs","./_object-dp":"Gfzd","./_object-keys":"knrM","./_object-gopn":"Ni5N","./_object-pie":"z7R8","./_object-gops":"Ocr3","./_library":"1kq3","./_hide":"akPY"}],"tuDi":[function(require,module,exports) {

},{}],"c6mp":[function(require,module,exports) {
require('./_wks-define')('asyncIterator');

},{"./_wks-define":"c2zY"}],"2mwf":[function(require,module,exports) {
require('./_wks-define')('observable');

},{"./_wks-define":"c2zY"}],"Ky5l":[function(require,module,exports) {
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;

},{"../../modules/es6.symbol":"Aa2f","../../modules/es6.object.to-string":"tuDi","../../modules/es7.symbol.async-iterator":"c6mp","../../modules/es7.symbol.observable":"2mwf","../../modules/_core":"ss9A"}],"ibPW":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":"Ky5l"}],"GyB/":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol/iterator":"6t7t","../core-js/symbol":"ibPW"}],"hEIm":[function(require,module,exports) {
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":"zotD"}],"af0K":[function(require,module,exports) {
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":"dhak","./_wks":"Ug9I"}],"vUQk":[function(require,module,exports) {
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":"Gfzd","./_property-desc":"uJ6d"}],"ZHvQ":[function(require,module,exports) {
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":"Z5df","./_wks":"Ug9I"}],"7AqT":[function(require,module,exports) {
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":"ZHvQ","./_wks":"Ug9I","./_iterators":"dhak","./_core":"ss9A"}],"Lli7":[function(require,module,exports) {
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":"Ug9I"}],"N484":[function(require,module,exports) {
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_ctx":"3zRh","./_export":"vSO4","./_to-object":"mbLO","./_iter-call":"hEIm","./_is-array-iter":"af0K","./_to-length":"S7IM","./_create-property":"vUQk","./core.get-iterator-method":"7AqT","./_iter-detect":"Lli7"}],"O35A":[function(require,module,exports) {
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/es6.string.iterator":"i+u+","../../modules/es6.array.from":"N484","../../modules/_core":"ss9A"}],"VuZO":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":"O35A"}],"mYpx":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _from = require("../core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
},{"../core-js/array/from":"VuZO"}],"uj5A":[function(require,module,exports) {
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_object-keys":"knrM","./_object-gops":"Ocr3","./_object-pie":"z7R8","./_to-object":"mbLO","./_iobject":"E5Ce","./_fails":"5BXi"}],"YD0x":[function(require,module,exports) {
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":"vSO4","./_object-assign":"uj5A"}],"vcHl":[function(require,module,exports) {
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/es6.object.assign":"YD0x","../../modules/_core":"ss9A"}],"gc0D":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":"vcHl"}],"T4f3":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _assign = require("../core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
},{"../core-js/object/assign":"gc0D"}],"cOHw":[function(require,module,exports) {
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_export":"vSO4","./_core":"ss9A","./_fails":"5BXi"}],"PDcB":[function(require,module,exports) {
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_to-object":"mbLO","./_object-keys":"knrM","./_object-sap":"cOHw"}],"eOjq":[function(require,module,exports) {
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;

},{"../../modules/es6.object.keys":"PDcB","../../modules/_core":"ss9A"}],"8FtN":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":"eOjq"}],"7Kpw":[function(require,module,exports) {
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":"M7z6"}],"o/ds":[function(require,module,exports) {
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":"vSO4","./_is-integer":"7Kpw"}],"hCBp":[function(require,module,exports) {
require('../../modules/es6.number.is-integer');
module.exports = require('../../modules/_core').Number.isInteger;

},{"../../modules/es6.number.is-integer":"o/ds","../../modules/_core":"ss9A"}],"6/OP":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/number/is-integer"), __esModule: true };
},{"core-js/library/fn/number/is-integer":"hCBp"}],"zCAL":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

exports.default = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};
},{}],"Yu+T":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveIndex = exports.replace = exports.repeat = exports.remove = exports.reduceWhile = exports.reduceIf = exports.prepend = exports.isPossibleFromObject = exports.isLastIndex = exports.isKey = exports.insert = exports.fromObject = exports.cycleNext = exports.convertIfNot = exports.append = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("babel-runtime/helpers/toConsumableArray"));

var _newArrowCheck2 = _interopRequireDefault(require("babel-runtime/helpers/newArrowCheck"));

var _Fun = require("flow-static-land/lib/Fun");

var _extends2 = _interopRequireDefault(require("babel-runtime/helpers/extends"));

var _from = _interopRequireDefault(require("babel-runtime/core-js/array/from"));

var _keys = _interopRequireDefault(require("babel-runtime/core-js/object/keys"));

var _isInteger = _interopRequireDefault(require("babel-runtime/core-js/number/is-integer"));

var _objectWithoutProperties2 = _interopRequireDefault(require("babel-runtime/helpers/objectWithoutProperties"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _this = undefined;
/**
 * Returns a new Array with elements appended to the one given.
 */

var append = function (elements, array) {
  (0, _newArrowCheck2.default)(this, _this);
  return [].concat((0, _toConsumableArray2.default)(array), (0, _toConsumableArray2.default)(elements));
}.bind(undefined);

var append$1 = (0, _Fun.curry)(append);
exports.append = append$1;
var _this$1 = undefined;
/**
 * Returns input if it is an Array or returns a new Array with input inside if
 * it is not.
 */

var convertIfNot = function (input) {
  (0, _newArrowCheck2.default)(this, _this$1);
  return Array.isArray(input) ? input : [input];
}.bind(undefined);

exports.convertIfNot = convertIfNot;
var _this$3 = undefined;
/**
 * Returns true if given index is the last one or false otherwise.
 */

var isLastIndex = function (array, index) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return index === array.length - 1;
}.bind(undefined);

var isLastIndex$1 = (0, _Fun.curry)(isLastIndex);
exports.isLastIndex = isLastIndex$1;
var _this$2 = undefined;
/**
 * Returns 0 if current index is the last one, or returns next if it is not.
 */

var cycleNext = function (array, currentIndex) {
  (0, _newArrowCheck2.default)(this, _this$2);
  return isLastIndex$1(array, currentIndex) ? 0 : currentIndex + 1;
}.bind(undefined);

var cycleNext$1 = (0, _Fun.curry)(cycleNext);
exports.cycleNext = cycleNext$1;
var _this$4 = undefined;

var getObjectLength = function (object) {
  (0, _newArrowCheck2.default)(this, _this$4);
  return Math.max.apply(Math, (0, _toConsumableArray2.default)((0, _keys.default)(object))) + 1;
}.bind(undefined);
/**
 * Creates a new array using the given object
 * If all of its entries are array keys.
 * 
 * (it could also have a property length with its size)
 */


var fromObject = function (object) {
  (0, _newArrowCheck2.default)(this, _this$4);
  return (0, _from.default)("length" in object ? object : (0, _extends2.default)({}, object, {
    length: getObjectLength(object)
  }));
}.bind(undefined);

exports.fromObject = fromObject;
var _this$5 = undefined;
/**
 * Returns a new Array with the result of having inserted the given elements at
 * the specified index.
 */

var insert = function (index, elements, array) {
  (0, _newArrowCheck2.default)(this, _this$5);
  return [].concat((0, _toConsumableArray2.default)(array.slice(0, index)), (0, _toConsumableArray2.default)(elements), (0, _toConsumableArray2.default)(array.slice(index + 1)));
}.bind(undefined);

var insert$1 = (0, _Fun.curry)(insert);
exports.insert = insert$1;
var _this$6 = undefined;

var isIntGreaterThan = function (number, other) {
  (0, _newArrowCheck2.default)(this, _this$6);
  return (0, _isInteger.default)(number) && number >= other;
}.bind(undefined);
/**
 * Returns true if the given string is an Array key or false otherwise.
 */


var isKey = function (string) {
  (0, _newArrowCheck2.default)(this, _this$6);
  return isIntGreaterThan(Number(string), 0);
}.bind(undefined);

exports.isKey = isKey;
var _this$7 = undefined;
/**
 * Returns true if an Array can be created from the given Object, or in other
 * words, if it has or not a length property, and the rest of its keys are Array
 * ones.
 */

var isPossibleFromObject = function (_ref) {
  var length = _ref.length,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["length"]);
  (0, _newArrowCheck2.default)(this, _this$7);
  return (0, _keys.default)(rest).every(isKey);
}.bind(undefined);

exports.isPossibleFromObject = isPossibleFromObject;
var _this$8 = undefined;
/**
 * Returns a new Array with elements prepended to the one given.
 */

var prepend = function (elements, array) {
  (0, _newArrowCheck2.default)(this, _this$8);
  return [].concat((0, _toConsumableArray2.default)(elements), (0, _toConsumableArray2.default)(array));
}.bind(undefined);

var prepend$1 = (0, _Fun.curry)(prepend);
exports.prepend = prepend$1;
var _this$9 = undefined;
/**
 * Reduce the given array applying reduce function only to elements filtered.
 */

var reduceIf = function (filter, reduce, resultInitial, array) {
  (0, _newArrowCheck2.default)(this, _this$9);
  return array.reduce(function (result, element, index) {
    (0, _newArrowCheck2.default)(this, _this$9);
    return filter(element, index, result) ? reduce(result, element, index) : result;
  }.bind(this), resultInitial);
}.bind(undefined);

var reduceIf$1 = (0, _Fun.curry)(reduceIf);
exports.reduceIf = reduceIf$1;
var _this$10 = undefined;
/**
 * Reduce the given array applying reduce function while shouldProceed function
 * returns true.
 */

var reduceWhile = function (shouldProceed, reduce, resultInitial, array) {
  (0, _newArrowCheck2.default)(this, _this$10);
  var result = resultInitial;
  array.every(function (element, index) {
    (0, _newArrowCheck2.default)(this, _this$10);
    var proceed = shouldProceed(element, index, result);

    if (proceed) {
      result = reduce(result, element, index);
    }

    return proceed;
  }.bind(this));
  return result;
}.bind(undefined);

var reduceWhile$1 = (0, _Fun.curry)(reduceWhile);
exports.reduceWhile = reduceWhile$1;
var _this$11 = undefined;
/**
 * Returns a new Array with the result of having removed the specified amount
 * (count) of elements at the given index.
 */

var remove = function (index, count, array) {
  (0, _newArrowCheck2.default)(this, _this$11);
  return [].concat((0, _toConsumableArray2.default)(array.slice(0, index)), (0, _toConsumableArray2.default)(array.slice(index + count)));
}.bind(undefined);

var remove$1 = (0, _Fun.curry)(remove);
exports.remove = remove$1;
var _this$12 = undefined;
/**
 * Returns a new Array with the given size (count) filled with the specified
 * element.
 */

var repeat = function (count, element) {
  (0, _newArrowCheck2.default)(this, _this$12);
  return [].concat((0, _toConsumableArray2.default)(Array(count))).map(function () {
    (0, _newArrowCheck2.default)(this, _this$12);
    return element;
  }.bind(this));
}.bind(undefined);

var repeat$1 = (0, _Fun.curry)(repeat);
exports.repeat = repeat$1;
var _this$13 = undefined;
/**
 * Returns a new Array with the result of having replaced the elements at the
 * given index with the ones specified.
 */

var replace = function (index, elements, array) {
  (0, _newArrowCheck2.default)(this, _this$13);
  return [].concat((0, _toConsumableArray2.default)(array.slice(0, index)), (0, _toConsumableArray2.default)(elements), (0, _toConsumableArray2.default)(array.slice(index + elements.length)));
}.bind(undefined);

var replace$1 = (0, _Fun.curry)(replace);
exports.replace = replace$1;
var _this$14 = undefined;
/**
 * Returns an absolute index from a relative one.
 * 
 * Relative indexes differ from absolute ones in that they can be negative and
 * in those cases it would be as simple as substracting them from the length of
 * the array from where they belong to obtain their absolute counterparts.
 */

var resolveIndex = function (array, relativeIndex) {
  (0, _newArrowCheck2.default)(this, _this$14);
  return relativeIndex < 0 ? array.length - relativeIndex : relativeIndex;
}.bind(undefined);

var resolveIndex$1 = (0, _Fun.curry)(resolveIndex);
exports.resolveIndex = resolveIndex$1;
},{"babel-runtime/helpers/toConsumableArray":"mYpx","babel-runtime/helpers/newArrowCheck":"EIvU","flow-static-land/lib/Fun":"o7wy","babel-runtime/helpers/extends":"T4f3","babel-runtime/core-js/array/from":"VuZO","babel-runtime/core-js/object/keys":"8FtN","babel-runtime/core-js/number/is-integer":"6/OP","babel-runtime/helpers/objectWithoutProperties":"zCAL"}],"jIGR":[function(require,module,exports) {
'use strict';

module.exports = function equal(a, b) {
  if (a === b) return true;

  var arrA = Array.isArray(a)
    , arrB = Array.isArray(b)
    , i;

  if (arrA && arrB) {
    if (a.length != b.length) return false;
    for (i = 0; i < a.length; i++)
      if (!equal(a[i], b[i])) return false;
    return true;
  }

  if (arrA != arrB) return false;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    var keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;

    var dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA && dateB) return a.getTime() == b.getTime();
    if (dateA != dateB) return false;

    var regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA && regexpB) return a.toString() == b.toString();
    if (regexpA != regexpB) return false;

    for (i = 0; i < keys.length; i++)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = 0; i < keys.length; i++)
      if(!equal(a[keys[i]], b[keys[i]])) return false;

    return true;
  }

  return false;
};

},{}],"htFH":[function(require,module,exports) {
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_export":"vSO4","./_descriptors":"6MLN","./_object-dp":"Gfzd"}],"3v7p":[function(require,module,exports) {
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/es6.object.define-property":"htFH","../../modules/_core":"ss9A"}],"FFZn":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":"3v7p"}],"Xos8":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};
},{"../core-js/object/define-property":"FFZn"}],"By4a":[function(require,module,exports) {
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};

},{"./_classof":"ZHvQ","./_wks":"Ug9I","./_iterators":"dhak","./_core":"ss9A"}],"TEgB":[function(require,module,exports) {
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');

},{"../modules/web.dom.iterable":"COf8","../modules/es6.string.iterator":"i+u+","../modules/core.is-iterable":"By4a"}],"gkZy":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":"TEgB"}],"ugM7":[function(require,module,exports) {
var anObject = require('./_an-object');
var get = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":"zotD","./core.get-iterator-method":"7AqT","./_core":"ss9A"}],"Lvd3":[function(require,module,exports) {
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');

},{"../modules/web.dom.iterable":"COf8","../modules/es6.string.iterator":"i+u+","../modules/core.get-iterator":"ugM7"}],"X9RM":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":"Lvd3"}],"m8OI":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _isIterable2 = require("../core-js/is-iterable");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = require("../core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
},{"../core-js/is-iterable":"gkZy","../core-js/get-iterator":"X9RM"}],"d/AR":[function(require,module,exports) {
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":"knrM","./_to-iobject":"Wyka","./_object-pie":"z7R8"}],"Omhj":[function(require,module,exports) {
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":"vSO4","./_object-to-array":"d/AR"}],"lQ0T":[function(require,module,exports) {
require('../../modules/es7.object.entries');
module.exports = require('../../modules/_core').Object.entries;

},{"../../modules/es7.object.entries":"Omhj","../../modules/_core":"ss9A"}],"FgrW":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/object/entries"), __esModule: true };
},{"core-js/library/fn/object/entries":"lQ0T"}],"7Q0f":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateIn = exports.toUndefinedIfEmpty = exports.shallowEqual = exports.shallowCopy = exports.setIn = exports.set = exports.removeIn = exports.remove = exports.map = exports.isEmpty = exports.is = exports.haveSameProps = exports.hasKey = exports.hasIn = exports.getKeys = exports.getIn = exports.get = void 0;

var _newArrowCheck2 = _interopRequireDefault(require("babel-runtime/helpers/newArrowCheck"));

var _Fun = require("flow-static-land/lib/Fun");

var _typeof2 = _interopRequireDefault(require("babel-runtime/helpers/typeof"));

var _utilsArray = require("@jumpn/utils-array");

var _keys = _interopRequireDefault(require("babel-runtime/core-js/object/keys"));

var _toConsumableArray2 = _interopRequireDefault(require("babel-runtime/helpers/toConsumableArray"));

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _defineProperty2 = _interopRequireDefault(require("babel-runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("babel-runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("babel-runtime/helpers/slicedToArray"));

var _entries = _interopRequireDefault(require("babel-runtime/core-js/object/entries"));

var _objectWithoutProperties2 = _interopRequireDefault(require("babel-runtime/helpers/objectWithoutProperties"));

var _symbol = _interopRequireDefault(require("babel-runtime/core-js/symbol"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _this = void 0,
    get = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this), r[e];
}.bind(void 0),
    get$1 = (0, _Fun.curry)(get),
    _this$2 = void 0,
    isObject = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$2), null !== e && "object" === (void 0 === e ? "undefined" : (0, _typeof2.default)(e));
}.bind(void 0),
    is = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$2), Array.isArray(e) || isObject(e);
}.bind(void 0),
    _this$1 = void 0,
    getInIfNeeded = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$1), (0, _utilsArray.isLastIndex)(r, e) ? t : getInRecur(e + 1, r, t);
}.bind(void 0),
    getNotCompositeErrorMessage = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$1), "Expected to find a composite at [" + String(r.join(", ")) + "][" + String(e) + "], but instead got: " + (void 0 === t ? "undefined" : (0, _typeof2.default)(t));
}.bind(void 0),
    ensureIsComposite = function (e, r, t) {
  if ((0, _newArrowCheck2.default)(this, _this$1), is(t)) return t;
  throw new Error(getNotCompositeErrorMessage(e, r, t));
}.bind(void 0),
    getInRecur = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$1), void 0 === t ? void 0 : getInIfNeeded(e, r, get$1(r[e], ensureIsComposite(e, r, t)));
}.bind(void 0),
    getIn = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$1), 0 === e.length ? void 0 : getInRecur(0, e, r);
}.bind(void 0),
    getIn$1 = (0, _Fun.curry)(getIn),
    _this$3 = void 0,
    getKeys = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$3), Array.isArray(e) ? [].concat((0, _toConsumableArray2.default)(e.keys())) : (0, _keys.default)(e);
}.bind(void 0),
    _this$4 = void 0,
    hasIn = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$4), (0, _fastDeepEqual.default)(getIn$1(e, t), r);
}.bind(void 0),
    hasIn$1 = (0, _Fun.curry)(hasIn),
    _this$5 = void 0,
    hasKey = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$5), Object.prototype.hasOwnProperty.call(r, e);
}.bind(void 0),
    hasKey$1 = (0, _Fun.curry)(hasKey),
    _this$6 = void 0,
    haveSameProps = function (e, r) {
  (0, _newArrowCheck2.default)(this, _this$6);
  var t = getKeys(e);
  return t.length === getKeys(r).length && t.every(function (t) {
    return (0, _newArrowCheck2.default)(this, _this$6), hasKey$1(t, r) && get$1(t, e) === get$1(t, r);
  }.bind(this));
}.bind(void 0),
    haveSameProps$1 = (0, _Fun.curry)(haveSameProps),
    _this$7 = void 0,
    isEmpty = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$7), 0 === getKeys(e).length;
}.bind(void 0),
    _this$8 = void 0,
    mapObject = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$8), (0, _entries.default)(r).reduce(function (t, i) {
    var n = (0, _slicedToArray2.default)(i, 2),
        o = n[0],
        s = n[1];
    return (0, _newArrowCheck2.default)(this, _this$8), (0, _extends2.default)({}, t, (0, _defineProperty2.default)({}, o, e(s, o, r)));
  }.bind(this), {});
}.bind(void 0),
    map = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$8), Array.isArray(r) ? r.map(e) : mapObject(e, r);
}.bind(void 0),
    map$1 = (0, _Fun.curry)(map),
    _this$9 = void 0,
    objectRemove = function (e, r) {
  r[e];
  var t = (0, _objectWithoutProperties2.default)(r, [e]);
  return (0, _newArrowCheck2.default)(this, _this$9), t;
}.bind(void 0),
    remove$1 = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$9), Array.isArray(r) ? (0, _utilsArray.remove)(e, 1, r) : objectRemove(e, r);
}.bind(void 0),
    remove$2 = (0, _Fun.curry)(remove$1),
    _this$12 = void 0,
    shallowCopy = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$12), Array.isArray(e) ? [].concat((0, _toConsumableArray2.default)(e)) : (0, _extends2.default)({}, e);
}.bind(void 0),
    _this$11 = void 0,
    createReduceContext = function (e) {
  (0, _newArrowCheck2.default)(this, _this$11);
  var r = shallowCopy(e);
  return {
    origin: r,
    current: r,
    previous: void 0
  };
}.bind(void 0),
    set = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$11), t[e] = r, get$1(e, t);
}.bind(void 0),
    updateSet = function (e, r, t, i) {
  return (0, _newArrowCheck2.default)(this, _this$11), (0, _extends2.default)({}, i, {
    current: set(e[r], t, i.current),
    previous: i.current
  });
}.bind(void 0),
    updateRemove = function (e, r, t) {
  (0, _newArrowCheck2.default)(this, _this$11);
  var i = remove$2(e[r], t.current);
  return 0 === r ? (0, _extends2.default)({}, t, {
    current: i,
    origin: i
  }) : (0, _extends2.default)({}, t, {
    previous: set(e[r - 1], i, t.previous)
  });
}.bind(void 0),
    removeAction = (0, _symbol.default)("composite.updateIn.removeAction"),
    update = function (e, r, t, i) {
  return (0, _newArrowCheck2.default)(this, _this$11), t === removeAction ? updateRemove(e, r, i) : updateSet(e, r, t, i);
}.bind(void 0),
    createSupporting = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$11), "number" == typeof e ? [] : {};
}.bind(void 0),
    copyOrCreate = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$11), hasKey$1(e, t) ? shallowCopy(get$1(e, t)) : createSupporting(r);
}.bind(void 0),
    getNext = function (e, r, t, i) {
  return (0, _newArrowCheck2.default)(this, _this$11), (0, _utilsArray.isLastIndex)(e, t) ? r(get$1(e[t], i)) : copyOrCreate(e[t], e[t + 1], i);
}.bind(void 0),
    getReducer = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$11), function (t, i, n) {
    return (0, _newArrowCheck2.default)(this, _this$11), update(e, n, getNext(e, r, n, t.current), t);
  }.bind(this);
}.bind(void 0),
    updateIn = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$11), 0 === e.length ? t : e.reduce(getReducer(e, r), createReduceContext(t)).origin;
}.bind(void 0),
    updateInCurried = (0, _Fun.curry)(updateIn);

exports.updateIn = updateInCurried;
exports.shallowCopy = shallowCopy;
exports.remove = remove$2;
exports.map = map$1;
exports.isEmpty = isEmpty;
exports.haveSameProps = haveSameProps$1;
exports.hasKey = hasKey$1;
exports.hasIn = hasIn$1;
exports.getKeys = getKeys;
exports.getIn = getIn$1;
exports.is = is;
exports.get = get$1;
updateInCurried.remove = removeAction;

var _this$10 = void 0,
    remove$3 = function () {
  return (0, _newArrowCheck2.default)(this, _this$10), updateInCurried.remove;
}.bind(void 0),
    removeIn = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$10), updateInCurried(e, remove$3, r);
}.bind(void 0),
    removeIn$1 = (0, _Fun.curry)(removeIn),
    _this$13 = void 0,
    set$1 = function (e, r, t) {
  (0, _newArrowCheck2.default)(this, _this$13);
  var i = shallowCopy(t);
  return i[e] = r, i;
}.bind(void 0),
    set$2 = (0, _Fun.curry)(set$1),
    _this$14 = void 0,
    setIn = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$14), updateInCurried(e, function () {
    return (0, _newArrowCheck2.default)(this, _this$14), r;
  }.bind(this), t);
}.bind(void 0),
    setIn$1 = (0, _Fun.curry)(setIn),
    _this$15 = void 0,
    xor = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$15), Boolean(Number(e) ^ Number(r));
}.bind(void 0),
    shallowEqual = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$15), e === r || !xor(Array.isArray(e), Array.isArray(r)) && haveSameProps$1(e, r);
}.bind(void 0),
    shallowEqual$1 = (0, _Fun.curry)(shallowEqual),
    _this$16 = void 0,
    toUndefinedIfEmpty = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$16), isEmpty(e) ? void 0 : e;
}.bind(void 0); //# sourceMappingURL=index.js.map


exports.toUndefinedIfEmpty = toUndefinedIfEmpty;
exports.shallowEqual = shallowEqual$1;
exports.setIn = setIn$1;
exports.set = set$2;
exports.removeIn = removeIn$1;
},{"babel-runtime/helpers/newArrowCheck":"EIvU","flow-static-land/lib/Fun":"o7wy","babel-runtime/helpers/typeof":"GyB/","@jumpn/utils-array":"Yu+T","babel-runtime/core-js/object/keys":"8FtN","babel-runtime/helpers/toConsumableArray":"mYpx","fast-deep-equal":"jIGR","babel-runtime/helpers/defineProperty":"Xos8","babel-runtime/helpers/extends":"T4f3","babel-runtime/helpers/slicedToArray":"m8OI","babel-runtime/core-js/object/entries":"FgrW","babel-runtime/helpers/objectWithoutProperties":"zCAL","babel-runtime/core-js/symbol":"ibPW"}],"XFqm":[function(require,module,exports) {
var define;
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Phoenix=t():e.Phoenix=t()}(this,function(){return function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){(function(t){e.exports=t.Phoenix=n(2)}).call(this,n(1))},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";function i(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],i=!0,o=!1,r=void 0;try{for(var s,a=e[Symbol.iterator]();!(i=(s=a.next()).done)&&(n.push(s.value),!t||n.length!==t);i=!0);}catch(e){o=!0,r=e}finally{try{i||null==a.return||a.return()}finally{if(o)throw r}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function c(e,t,n){return t&&a(e.prototype,t),n&&a(e,n),e}n.r(t),n.d(t,"Channel",function(){return b}),n.d(t,"Serializer",function(){return j}),n.d(t,"Socket",function(){return R}),n.d(t,"LongPoll",function(){return C}),n.d(t,"Ajax",function(){return T}),n.d(t,"Presence",function(){return w});var u="undefined"!=typeof self?self:null,h="undefined"!=typeof window?window:null,l=u||h||void 0,f={connecting:0,open:1,closing:2,closed:3},d=1e4,p={closed:"closed",errored:"errored",joined:"joined",joining:"joining",leaving:"leaving"},v={close:"phx_close",error:"phx_error",join:"phx_join",reply:"phx_reply",leave:"phx_leave"},y=[v.close,v.error,v.join,v.reply,v.leave],m={longpoll:"longpoll",websocket:"websocket"},g=function(e){if("function"==typeof e)return e;return function(){return e}},k=function(){function e(t,n,i,o){s(this,e),this.channel=t,this.event=n,this.payload=i||function(){return{}},this.receivedResp=null,this.timeout=o,this.timeoutTimer=null,this.recHooks=[],this.sent=!1}return c(e,[{key:"resend",value:function(e){this.timeout=e,this.reset(),this.send()}},{key:"send",value:function(){this.hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload(),ref:this.ref,join_ref:this.channel.joinRef()}))}},{key:"receive",value:function(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}},{key:"reset",value:function(){this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1}},{key:"matchReceive",value:function(e){var t=e.status,n=e.response;e.ref;this.recHooks.filter(function(e){return e.status===t}).forEach(function(e){return e.callback(n)})}},{key:"cancelRefEvent",value:function(){this.refEvent&&this.channel.off(this.refEvent)}},{key:"cancelTimeout",value:function(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}},{key:"startTimeout",value:function(){var e=this;this.timeoutTimer&&this.cancelTimeout(),this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,function(t){e.cancelRefEvent(),e.cancelTimeout(),e.receivedResp=t,e.matchReceive(t)}),this.timeoutTimer=setTimeout(function(){e.trigger("timeout",{})},this.timeout)}},{key:"hasReceived",value:function(e){return this.receivedResp&&this.receivedResp.status===e}},{key:"trigger",value:function(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}}]),e}(),b=function(){function e(t,n,i){var o=this;s(this,e),this.state=p.closed,this.topic=t,this.params=g(n||{}),this.socket=i,this.bindings=[],this.bindingRef=0,this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new k(this,v.join,this.params,this.timeout),this.pushBuffer=[],this.rejoinTimer=new E(function(){o.socket.isConnected()&&o.rejoin()},this.socket.rejoinAfterMs),this.socket.onError(function(){return o.rejoinTimer.reset()}),this.socket.onOpen(function(){o.rejoinTimer.reset(),o.isErrored()&&o.rejoin()}),this.joinPush.receive("ok",function(){o.state=p.joined,o.rejoinTimer.reset(),o.pushBuffer.forEach(function(e){return e.send()}),o.pushBuffer=[]}),this.joinPush.receive("error",function(){o.state=p.errored,o.socket.isConnected()&&o.rejoinTimer.scheduleTimeout()}),this.onClose(function(){o.rejoinTimer.reset(),o.socket.hasLogger()&&o.socket.log("channel","close ".concat(o.topic," ").concat(o.joinRef())),o.state=p.closed,o.socket.remove(o)}),this.onError(function(e){o.socket.hasLogger()&&o.socket.log("channel","error ".concat(o.topic),e),o.isJoining()&&o.joinPush.reset(),o.state=p.errored,o.socket.isConnected()&&o.rejoinTimer.scheduleTimeout()}),this.joinPush.receive("timeout",function(){o.socket.hasLogger()&&o.socket.log("channel","timeout ".concat(o.topic," (").concat(o.joinRef(),")"),o.joinPush.timeout),new k(o,v.leave,g({}),o.timeout).send(),o.state=p.errored,o.joinPush.reset(),o.socket.isConnected()&&o.rejoinTimer.scheduleTimeout()}),this.on(v.reply,function(e,t){o.trigger(o.replyEventName(t),e)})}return c(e,[{key:"join",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.timeout;if(this.joinedOnce)throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");return this.timeout=e,this.joinedOnce=!0,this.rejoin(),this.joinPush}},{key:"onClose",value:function(e){this.on(v.close,e)}},{key:"onError",value:function(e){return this.on(v.error,function(t){return e(t)})}},{key:"on",value:function(e,t){var n=this.bindingRef++;return this.bindings.push({event:e,ref:n,callback:t}),n}},{key:"off",value:function(e,t){this.bindings=this.bindings.filter(function(n){return!(n.event===e&&(void 0===t||t===n.ref))})}},{key:"canPush",value:function(){return this.socket.isConnected()&&this.isJoined()}},{key:"push",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.timeout;if(!this.joinedOnce)throw new Error("tried to push '".concat(e,"' to '").concat(this.topic,"' before joining. Use channel.join() before pushing events"));var i=new k(this,e,function(){return t},n);return this.canPush()?i.send():(i.startTimeout(),this.pushBuffer.push(i)),i}},{key:"leave",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.timeout;this.rejoinTimer.reset(),this.joinPush.cancelTimeout(),this.state=p.leaving;var n=function(){e.socket.hasLogger()&&e.socket.log("channel","leave ".concat(e.topic)),e.trigger(v.close,"leave")},i=new k(this,v.leave,g({}),t);return i.receive("ok",function(){return n()}).receive("timeout",function(){return n()}),i.send(),this.canPush()||i.trigger("ok",{}),i}},{key:"onMessage",value:function(e,t,n){return t}},{key:"isLifecycleEvent",value:function(e){return y.indexOf(e)>=0}},{key:"isMember",value:function(e,t,n,i){return this.topic===e&&(!i||i===this.joinRef()||!this.isLifecycleEvent(t)||(this.socket.hasLogger()&&this.socket.log("channel","dropping outdated message",{topic:e,event:t,payload:n,joinRef:i}),!1))}},{key:"joinRef",value:function(){return this.joinPush.ref}},{key:"sendJoin",value:function(e){this.state=p.joining,this.joinPush.resend(e)}},{key:"rejoin",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.timeout;this.isLeaving()||this.sendJoin(e)}},{key:"trigger",value:function(e,t,n,i){var o=this.onMessage(e,t,n,i);if(t&&!o)throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");for(var r=0;r<this.bindings.length;r++){var s=this.bindings[r];s.event===e&&s.callback(o,n,i||this.joinRef())}}},{key:"replyEventName",value:function(e){return"chan_reply_".concat(e)}},{key:"isClosed",value:function(){return this.state===p.closed}},{key:"isErrored",value:function(){return this.state===p.errored}},{key:"isJoined",value:function(){return this.state===p.joined}},{key:"isJoining",value:function(){return this.state===p.joining}},{key:"isLeaving",value:function(){return this.state===p.leaving}}]),e}(),j={encode:function(e,t){var n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))},decode:function(e,t){var n=r(JSON.parse(e),5);return t({join_ref:n[0],ref:n[1],topic:n[2],event:n[3],payload:n[4]})}},R=function(){function e(t){var n=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};s(this,e),this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.timeout=i.timeout||d,this.transport=i.transport||l.WebSocket||C,this.defaultEncoder=j.encode,this.defaultDecoder=j.decode,this.closeWasClean=!1,this.unloaded=!1,this.binaryType=i.binaryType||"arraybuffer",this.transport!==C?(this.encode=i.encode||this.defaultEncoder,this.decode=i.decode||this.defaultDecoder):(this.encode=this.defaultEncoder,this.decode=this.defaultDecoder),h&&h.addEventListener&&h.addEventListener("beforeunload",function(e){n.conn&&(n.unloaded=!0,n.abnormalClose("unloaded"))}),this.heartbeatIntervalMs=i.heartbeatIntervalMs||3e4,this.rejoinAfterMs=function(e){return i.rejoinAfterMs?i.rejoinAfterMs(e):[1e3,2e3,5e3][e-1]||1e4},this.reconnectAfterMs=function(e){return n.unloaded?100:i.reconnectAfterMs?i.reconnectAfterMs(e):[10,50,100,150,200,250,500,1e3,2e3][e-1]||5e3},this.logger=i.logger||null,this.longpollerTimeout=i.longpollerTimeout||2e4,this.params=g(i.params||{}),this.endPoint="".concat(t,"/").concat(m.websocket),this.heartbeatTimer=null,this.pendingHeartbeatRef=null,this.reconnectTimer=new E(function(){n.teardown(function(){return n.connect()})},this.reconnectAfterMs)}return c(e,[{key:"protocol",value:function(){return location.protocol.match(/^https/)?"wss":"ws"}},{key:"endPointURL",value:function(){var e=T.appendParams(T.appendParams(this.endPoint,this.params()),{vsn:"2.0.0"});return"/"!==e.charAt(0)?e:"/"===e.charAt(1)?"".concat(this.protocol(),":").concat(e):"".concat(this.protocol(),"://").concat(location.host).concat(e)}},{key:"disconnect",value:function(e,t,n){this.closeWasClean=!0,this.reconnectTimer.reset(),this.teardown(e,t,n)}},{key:"connect",value:function(e){var t=this;e&&(console&&console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"),this.params=g(e)),this.conn||(this.closeWasClean=!1,this.conn=new this.transport(this.endPointURL()),this.conn.binaryType=this.binaryType,this.conn.timeout=this.longpollerTimeout,this.conn.onopen=function(){return t.onConnOpen()},this.conn.onerror=function(e){return t.onConnError(e)},this.conn.onmessage=function(e){return t.onConnMessage(e)},this.conn.onclose=function(e){return t.onConnClose(e)})}},{key:"log",value:function(e,t,n){this.logger(e,t,n)}},{key:"hasLogger",value:function(){return null!==this.logger}},{key:"onOpen",value:function(e){this.stateChangeCallbacks.open.push(e)}},{key:"onClose",value:function(e){this.stateChangeCallbacks.close.push(e)}},{key:"onError",value:function(e){this.stateChangeCallbacks.error.push(e)}},{key:"onMessage",value:function(e){this.stateChangeCallbacks.message.push(e)}},{key:"onConnOpen",value:function(){this.hasLogger()&&this.log("transport","connected to ".concat(this.endPointURL())),this.unloaded=!1,this.closeWasClean=!1,this.flushSendBuffer(),this.reconnectTimer.reset(),this.resetHeartbeat(),this.stateChangeCallbacks.open.forEach(function(e){return e()})}},{key:"resetHeartbeat",value:function(){var e=this;this.conn&&this.conn.skipHeartbeat||(this.pendingHeartbeatRef=null,clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(function(){return e.sendHeartbeat()},this.heartbeatIntervalMs))}},{key:"teardown",value:function(e,t,n){this.conn&&(this.conn.onclose=function(){},t?this.conn.close(t,n||""):this.conn.close(),this.conn=null),e&&e()}},{key:"onConnClose",value:function(e){this.hasLogger()&&this.log("transport","close",e),this.triggerChanError(),clearInterval(this.heartbeatTimer),this.closeWasClean||this.reconnectTimer.scheduleTimeout(),this.stateChangeCallbacks.close.forEach(function(t){return t(e)})}},{key:"onConnError",value:function(e){this.hasLogger()&&this.log("transport",e),this.triggerChanError(),this.stateChangeCallbacks.error.forEach(function(t){return t(e)})}},{key:"triggerChanError",value:function(){this.channels.forEach(function(e){e.isErrored()||e.isLeaving()||e.isClosed()||e.trigger(v.error)})}},{key:"connectionState",value:function(){switch(this.conn&&this.conn.readyState){case f.connecting:return"connecting";case f.open:return"open";case f.closing:return"closing";default:return"closed"}}},{key:"isConnected",value:function(){return"open"===this.connectionState()}},{key:"remove",value:function(e){this.channels=this.channels.filter(function(t){return t.joinRef()!==e.joinRef()})}},{key:"channel",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=new b(e,t,this);return this.channels.push(n),n}},{key:"push",value:function(e){var t=this;if(this.hasLogger()){var n=e.topic,i=e.event,o=e.payload,r=e.ref,s=e.join_ref;this.log("push","".concat(n," ").concat(i," (").concat(s,", ").concat(r,")"),o)}this.isConnected()?this.encode(e,function(e){return t.conn.send(e)}):this.sendBuffer.push(function(){return t.encode(e,function(e){return t.conn.send(e)})})}},{key:"makeRef",value:function(){var e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}},{key:"sendHeartbeat",value:function(){if(this.isConnected()){if(this.pendingHeartbeatRef)return this.pendingHeartbeatRef=null,this.hasLogger()&&this.log("transport","heartbeat timeout. Attempting to re-establish connection"),void this.abnormalClose("heartbeat timeout");this.pendingHeartbeatRef=this.makeRef(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef})}}},{key:"abnormalClose",value:function(e){this.closeWasClean=!1,this.conn.close(1e3,e)}},{key:"flushSendBuffer",value:function(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(function(e){return e()}),this.sendBuffer=[])}},{key:"onConnMessage",value:function(e){var t=this;this.decode(e.data,function(e){var n=e.topic,i=e.event,o=e.payload,r=e.ref,s=e.join_ref;r&&r===t.pendingHeartbeatRef&&(t.pendingHeartbeatRef=null),t.hasLogger()&&t.log("receive","".concat(o.status||""," ").concat(n," ").concat(i," ").concat(r&&"("+r+")"||""),o);for(var a=0;a<t.channels.length;a++){var c=t.channels[a];c.isMember(n,i,o,s)&&c.trigger(i,o,r,s)}for(var u=0;u<t.stateChangeCallbacks.message.length;u++)t.stateChangeCallbacks.message[u](e)})}}]),e}(),C=function(){function e(t){s(this,e),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(t),this.readyState=f.connecting,this.poll()}return c(e,[{key:"normalizeEndpoint",value:function(e){return e.replace("ws://","http://").replace("wss://","https://").replace(new RegExp("(.*)/"+m.websocket),"$1/"+m.longpoll)}},{key:"endpointURL",value:function(){return T.appendParams(this.pollEndpoint,{token:this.token})}},{key:"closeAndRetry",value:function(){this.close(),this.readyState=f.connecting}},{key:"ontimeout",value:function(){this.onerror("timeout"),this.closeAndRetry()}},{key:"poll",value:function(){var e=this;this.readyState!==f.open&&this.readyState!==f.connecting||T.request("GET",this.endpointURL(),"application/json",null,this.timeout,this.ontimeout.bind(this),function(t){if(t){var n=t.status,i=t.token,o=t.messages;e.token=i}else n=0;switch(n){case 200:o.forEach(function(t){return e.onmessage({data:t})}),e.poll();break;case 204:e.poll();break;case 410:e.readyState=f.open,e.onopen(),e.poll();break;case 0:case 500:e.onerror(),e.closeAndRetry();break;default:throw new Error("unhandled poll status ".concat(n))}})}},{key:"send",value:function(e){var t=this;T.request("POST",this.endpointURL(),"application/json",e,this.timeout,this.onerror.bind(this,"timeout"),function(e){e&&200===e.status||(t.onerror(e&&e.status),t.closeAndRetry())})}},{key:"close",value:function(e,t){this.readyState=f.closed,this.onclose()}}]),e}(),T=function(){function e(){s(this,e)}return c(e,null,[{key:"request",value:function(e,t,n,i,o,r,s){if(l.XDomainRequest){var a=new XDomainRequest;this.xdomainRequest(a,e,t,i,o,r,s)}else{var c=l.XMLHttpRequest?new l.XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");this.xhrRequest(c,e,t,n,i,o,r,s)}}},{key:"xdomainRequest",value:function(e,t,n,i,o,r,s){var a=this;e.timeout=o,e.open(t,n),e.onload=function(){var t=a.parseJSON(e.responseText);s&&s(t)},r&&(e.ontimeout=r),e.onprogress=function(){},e.send(i)}},{key:"xhrRequest",value:function(e,t,n,i,o,r,s,a){var c=this;e.open(t,n,!0),e.timeout=r,e.setRequestHeader("Content-Type",i),e.onerror=function(){a&&a(null)},e.onreadystatechange=function(){if(e.readyState===c.states.complete&&a){var t=c.parseJSON(e.responseText);a(t)}},s&&(e.ontimeout=s),e.send(o)}},{key:"parseJSON",value:function(e){if(!e||""===e)return null;try{return JSON.parse(e)}catch(t){return console&&console.log("failed to parse JSON response",e),null}}},{key:"serialize",value:function(e,t){var n=[];for(var i in e)if(e.hasOwnProperty(i)){var r=t?"".concat(t,"[").concat(i,"]"):i,s=e[i];"object"===o(s)?n.push(this.serialize(s,r)):n.push(encodeURIComponent(r)+"="+encodeURIComponent(s))}return n.join("&")}},{key:"appendParams",value:function(e,t){if(0===Object.keys(t).length)return e;var n=e.match(/\?/)?"&":"?";return"".concat(e).concat(n).concat(this.serialize(t))}}]),e}();T.states={complete:4};var w=function(){function e(t){var n=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};s(this,e);var o=i.events||{state:"presence_state",diff:"presence_diff"};this.state={},this.pendingDiffs=[],this.channel=t,this.joinRef=null,this.caller={onJoin:function(){},onLeave:function(){},onSync:function(){}},this.channel.on(o.state,function(t){var i=n.caller,o=i.onJoin,r=i.onLeave,s=i.onSync;n.joinRef=n.channel.joinRef(),n.state=e.syncState(n.state,t,o,r),n.pendingDiffs.forEach(function(t){n.state=e.syncDiff(n.state,t,o,r)}),n.pendingDiffs=[],s()}),this.channel.on(o.diff,function(t){var i=n.caller,o=i.onJoin,r=i.onLeave,s=i.onSync;n.inPendingSyncState()?n.pendingDiffs.push(t):(n.state=e.syncDiff(n.state,t,o,r),s())})}return c(e,[{key:"onJoin",value:function(e){this.caller.onJoin=e}},{key:"onLeave",value:function(e){this.caller.onLeave=e}},{key:"onSync",value:function(e){this.caller.onSync=e}},{key:"list",value:function(t){return e.list(this.state,t)}},{key:"inPendingSyncState",value:function(){return!this.joinRef||this.joinRef!==this.channel.joinRef()}}],[{key:"syncState",value:function(e,t,n,i){var o=this,r=this.clone(e),s={},a={};return this.map(r,function(e,n){t[e]||(a[e]=n)}),this.map(t,function(e,t){var n=r[e];if(n){var i=t.metas.map(function(e){return e.phx_ref}),c=n.metas.map(function(e){return e.phx_ref}),u=t.metas.filter(function(e){return c.indexOf(e.phx_ref)<0}),h=n.metas.filter(function(e){return i.indexOf(e.phx_ref)<0});u.length>0&&(s[e]=t,s[e].metas=u),h.length>0&&(a[e]=o.clone(n),a[e].metas=h)}else s[e]=t}),this.syncDiff(r,{joins:s,leaves:a},n,i)}},{key:"syncDiff",value:function(e,t,n,o){var r=t.joins,s=t.leaves,a=this.clone(e);return n||(n=function(){}),o||(o=function(){}),this.map(r,function(e,t){var o=a[e];if(a[e]=t,o){var r,s=a[e].metas.map(function(e){return e.phx_ref}),c=o.metas.filter(function(e){return s.indexOf(e.phx_ref)<0});(r=a[e].metas).unshift.apply(r,i(c))}n(e,o,t)}),this.map(s,function(e,t){var n=a[e];if(n){var i=t.metas.map(function(e){return e.phx_ref});n.metas=n.metas.filter(function(e){return i.indexOf(e.phx_ref)<0}),o(e,n,t),0===n.metas.length&&delete a[e]}}),a}},{key:"list",value:function(e,t){return t||(t=function(e,t){return t}),this.map(e,function(e,n){return t(e,n)})}},{key:"map",value:function(e,t){return Object.getOwnPropertyNames(e).map(function(n){return t(n,e[n])})}},{key:"clone",value:function(e){return JSON.parse(JSON.stringify(e))}}]),e}(),E=function(){function e(t,n){s(this,e),this.callback=t,this.timerCalc=n,this.timer=null,this.tries=0}return c(e,[{key:"reset",value:function(){this.tries=0,clearTimeout(this.timer)}},{key:"scheduleTimeout",value:function(){var e=this;clearTimeout(this.timer),this.timer=setTimeout(function(){e.tries=e.tries+1,e.callback()},this.timerCalc(this.tries+1))}}]),e}()}])});
},{}],"g6sb":[function(require,module,exports) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_iobject":"nGau","./_defined":"+Bjj"}],"vfEH":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":"yjVO"}],"4Ca7":[function(require,module,exports) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-iobject":"g6sb","./_to-length":"dJBs","./_to-absolute-index":"vfEH"}],"NaGB":[function(require,module,exports) {
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":"6zGc","./_uid":"U49f"}],"vL0Z":[function(require,module,exports) {
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_has":"2uHg","./_to-iobject":"g6sb","./_array-includes":"4Ca7","./_shared-key":"NaGB"}],"U9a7":[function(require,module,exports) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_object-keys-internal":"vL0Z","./_enum-bug-keys":"KxjL"}],"MiMz":[function(require,module,exports) {
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_object-dp":"nw8e","./_an-object":"eT53","./_object-keys":"U9a7","./_descriptors":"P9Ib"}],"xj/b":[function(require,module,exports) {
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":"5qf4"}],"sYaK":[function(require,module,exports) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":"eT53","./_object-dps":"MiMz","./_enum-bug-keys":"KxjL","./_shared-key":"NaGB","./_dom-create":"/vZ6","./_html":"xj/b"}],"rq3q":[function(require,module,exports) {
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_object-dp":"nw8e","./_has":"2uHg","./_wks":"44AI"}],"ebgP":[function(require,module,exports) {
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_object-create":"sYaK","./_property-desc":"uJ6d","./_set-to-string-tag":"rq3q","./_hide":"0NXb","./_wks":"44AI"}],"8q6y":[function(require,module,exports) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":"2uHg","./_to-object":"rfVX","./_shared-key":"NaGB"}],"mH0U":[function(require,module,exports) {
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_library":"H21C","./_export":"izCb","./_redefine":"PHot","./_hide":"0NXb","./_iterators":"dhak","./_iter-create":"ebgP","./_set-to-string-tag":"rq3q","./_object-gpo":"8q6y","./_wks":"44AI"}],"6w+v":[function(require,module,exports) {
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":"Z7e/","./_iter-step":"xwD+","./_iterators":"dhak","./_to-iobject":"g6sb","./_iter-define":"mH0U"}],"v6Aj":[function(require,module,exports) {

var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./es6.array.iterator":"6w+v","./_object-keys":"U9a7","./_redefine":"PHot","./_global":"5qf4","./_hide":"0NXb","./_iterators":"dhak","./_wks":"44AI"}],"2Hh2":[function(require,module,exports) {
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":"5BXi"}],"VsIt":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-methods":"AuPh","./_strict-method":"2Hh2"}],"XfJI":[function(require,module,exports) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;
},{}],"OMTj":[function(require,module,exports) {
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;
},{}],"wF/n":[function(require,module,exports) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;
},{}],"Fhqp":[function(require,module,exports) {
var arrayWithoutHoles = require("./arrayWithoutHoles");

var iterableToArray = require("./iterableToArray");

var nonIterableSpread = require("./nonIterableSpread");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
},{"./arrayWithoutHoles":"XfJI","./iterableToArray":"OMTj","./nonIterableSpread":"wF/n"}],"RBsu":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-methods":"AuPh","./_strict-method":"2Hh2"}],"x5yM":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_to-integer":"yjVO","./_defined":"+Bjj"}],"/t3a":[function(require,module,exports) {
'use strict';
var at = require('./_string-at')(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

},{"./_string-at":"x5yM"}],"GM7B":[function(require,module,exports) {
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":"Z5df","./_wks":"44AI"}],"sNFG":[function(require,module,exports) {
'use strict';

var classof = require('./_classof');
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};

},{"./_classof":"GM7B"}],"hgks":[function(require,module,exports) {
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":"eT53"}],"ZcPD":[function(require,module,exports) {
'use strict';

var regexpFlags = require('./_flags');

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

},{"./_flags":"hgks"}],"S07n":[function(require,module,exports) {
'use strict';
var regexpExec = require('./_regexp-exec');
require('./_export')({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

},{"./_regexp-exec":"ZcPD","./_export":"izCb"}],"LmBS":[function(require,module,exports) {
'use strict';
require('./es6.regexp.exec');
var redefine = require('./_redefine');
var hide = require('./_hide');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');
var regexpExec = require('./_regexp-exec');

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./es6.regexp.exec":"S07n","./_redefine":"PHot","./_hide":"0NXb","./_fails":"5BXi","./_defined":"+Bjj","./_wks":"44AI","./_regexp-exec":"ZcPD"}],"RTfC":[function(require,module,exports) {
'use strict';

var anObject = require('./_an-object');
var toLength = require('./_to-length');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

},{"./_an-object":"eT53","./_to-length":"dJBs","./_advance-string-index":"/t3a","./_regexp-exec-abstract":"sNFG","./_fix-re-wks":"LmBS"}],"dwTY":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $some = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-methods":"AuPh","./_strict-method":"2Hh2"}],"xcbV":[function(require,module,exports) {
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],"h83E":[function(require,module,exports) {
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":"6kYj","./_is-object":"M7z6","./_invoke":"xcbV"}],"WIhg":[function(require,module,exports) {
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_export":"izCb","./_bind":"h83E"}],"tS9b":[function(require,module,exports) {
function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
}

module.exports = _newArrowCheck;
},{}],"2hqA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestToCompat = exports.requestFromCompat = exports.hasSubscription = exports.getOperationType = exports.errorsToString = void 0;

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.array.some");

require("core-js/modules/es6.function.bind");

var _newArrowCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/newArrowCheck"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _this = undefined;

var locationsToString = function locationsToString(locations) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this);
  return locations.map(function (_ref) {
    var column = _ref.column,
        line = _ref.line;
    (0, _newArrowCheck2.default)(this, _this2);
    return "".concat(line, ":").concat(column);
  }.bind(this)).join("; ");
}.bind(undefined);

var errorToString = function errorToString(_ref2) {
  var message = _ref2.message,
      locations = _ref2.locations;
  (0, _newArrowCheck2.default)(this, _this);
  return message + (locations ? " (".concat(locationsToString(locations), ")") : "");
}.bind(undefined);
/**
 * Transforms an array of GqlError into a string.
 *
 * @example
 *
 * const gqlRespose = {
 *   errors: [
 *     {message: "First Error", locations: [{column: 10, line: 2}]},
 *     {message: "Second Error", locations: [{column: 2, line: 4}]}
 *   ]
 * }
 *
 * const error = errorsToString(gqlRespose.errors);
 * // string with the following:
 * // First Error (2:10)
 * // Second Error (4:2)
 */


var errorsToString = function errorsToString(gqlErrors) {
  (0, _newArrowCheck2.default)(this, _this);
  return gqlErrors.map(errorToString).join("\n");
}.bind(undefined);

exports.errorsToString = errorsToString;
var _this$1 = undefined;
var operationTypeRe = /^\s*(query|mutation|subscription|\{)/;

var getOperationTypeFromMatched = function getOperationTypeFromMatched(matched) {
  (0, _newArrowCheck2.default)(this, _this$1);
  return matched === "{" ? "query" : matched;
}.bind(undefined);
/**
 * Returns the type (query, mutation, or subscription) of the given operation
 *
 * @example
 *
 * const operation = `
 *   subscription userSubscription($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * const operationType = getOperationType(operation);
 *
 * console.log(operationType); // "subscription"
 */


var getOperationType = function getOperationType(operation) {
  (0, _newArrowCheck2.default)(this, _this$1);
  var result = operation.match(operationTypeRe);

  if (!result) {
    throw new TypeError("Invalid operation:\n".concat(operation));
  }

  return getOperationTypeFromMatched(result[1]);
}.bind(undefined);

exports.getOperationType = getOperationType;
var _this$2 = undefined;

var isSubscription = function isSubscription(definition) {
  (0, _newArrowCheck2.default)(this, _this$2);
  return definition.kind === "OperationDefinition" && definition.operation === "subscription";
}.bind(undefined);
/**
 * Returns true if documentNode has a subscription or false otherwise
 */


var hasSubscription = function hasSubscription(documentNode) {
  (0, _newArrowCheck2.default)(this, _this$2);
  return documentNode.definitions.some(isSubscription);
}.bind(undefined);

exports.hasSubscription = hasSubscription;
var _this$3 = undefined;
/**
 * Creates a GqlRequest using given GqlRequestCompat
 *
 * @param {GqlRequestCompat<Variables>} gqlRequestCompat
 *
 * @return {GqlRequest<Variables>} 
 *
 * @example
 * const query = `
 *   query userQuery($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       email
 *     }
 *   }
 * `;
 * 
 * console.log(requestFromCompat({query, variables: {userId: 10}}));
 * // {operation: "...", variables: {userId: 10}}
 */

var requestFromCompat = function requestFromCompat(_ref) {
  var operation = _ref.query,
      variables = _ref.variables;
  (0, _newArrowCheck2.default)(this, _this$3);
  return variables ? {
    operation: operation,
    variables: variables
  } : {
    operation: operation
  };
}.bind(undefined);

exports.requestFromCompat = requestFromCompat;
var _this$4 = undefined;
/**
 * Creates a GqlRequest using given GqlRequestCompat
 *
 * @param {GqlRequest<Variables>} gqlRequest
 *
 * @return {GqlRequestCompat<Variables>}
 * 
 * @example
 * const operation = `
 *   query userQuery($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       email
 *     }
 *   }
 * `;
 * 
 * console.log(requestToCompat({operation, variables: {userId: 10}}));
 * // {query: "...", variables: {userId: 10}}
 */

var requestToCompat = function requestToCompat(_ref) {
  var query = _ref.operation,
      variables = _ref.variables;
  (0, _newArrowCheck2.default)(this, _this$4);
  return variables ? {
    query: query,
    variables: variables
  } : {
    query: query
  };
}.bind(undefined); //# sourceMappingURL=index.js.map


exports.requestToCompat = requestToCompat;
},{"core-js/modules/es6.array.map":"RBsu","core-js/modules/es6.regexp.match":"RTfC","core-js/modules/es6.array.some":"dwTY","core-js/modules/es6.function.bind":"WIhg","@babel/runtime/helpers/newArrowCheck":"tS9b"}],"AVeU":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// === Symbol Support ===

var hasSymbols = function () {
  return typeof Symbol === 'function';
};
var hasSymbol = function (name) {
  return hasSymbols() && Boolean(Symbol[name]);
};
var getSymbol = function (name) {
  return hasSymbol(name) ? Symbol[name] : '@@' + name;
};

if (hasSymbols() && !hasSymbol('observable')) {
  Symbol.observable = Symbol('observable');
}

var SymbolIterator = getSymbol('iterator');
var SymbolObservable = getSymbol('observable');
var SymbolSpecies = getSymbol('species');

// === Abstract Operations ===

function getMethod(obj, key) {
  var value = obj[key];

  if (value == null) return undefined;

  if (typeof value !== 'function') throw new TypeError(value + ' is not a function');

  return value;
}

function getSpecies(obj) {
  var ctor = obj.constructor;
  if (ctor !== undefined) {
    ctor = ctor[SymbolSpecies];
    if (ctor === null) {
      ctor = undefined;
    }
  }
  return ctor !== undefined ? ctor : Observable;
}

function isObservable(x) {
  return x instanceof Observable; // SPEC: Brand check
}

function hostReportError(e) {
  if (hostReportError.log) {
    hostReportError.log(e);
  } else {
    setTimeout(function () {
      throw e;
    });
  }
}

function enqueue(fn) {
  Promise.resolve().then(function () {
    try {
      fn();
    } catch (e) {
      hostReportError(e);
    }
  });
}

function cleanupSubscription(subscription) {
  var cleanup = subscription._cleanup;
  if (cleanup === undefined) return;

  subscription._cleanup = undefined;

  if (!cleanup) {
    return;
  }

  try {
    if (typeof cleanup === 'function') {
      cleanup();
    } else {
      var unsubscribe = getMethod(cleanup, 'unsubscribe');
      if (unsubscribe) {
        unsubscribe.call(cleanup);
      }
    }
  } catch (e) {
    hostReportError(e);
  }
}

function closeSubscription(subscription) {
  subscription._observer = undefined;
  subscription._queue = undefined;
  subscription._state = 'closed';
}

function flushSubscription(subscription) {
  var queue = subscription._queue;
  if (!queue) {
    return;
  }
  subscription._queue = undefined;
  subscription._state = 'ready';
  for (var i = 0; i < queue.length; ++i) {
    notifySubscription(subscription, queue[i].type, queue[i].value);
    if (subscription._state === 'closed') break;
  }
}

function notifySubscription(subscription, type, value) {
  subscription._state = 'running';

  var observer = subscription._observer;

  try {
    var m = getMethod(observer, type);
    switch (type) {
      case 'next':
        if (m) m.call(observer, value);
        break;
      case 'error':
        closeSubscription(subscription);
        if (m) m.call(observer, value);else throw value;
        break;
      case 'complete':
        closeSubscription(subscription);
        if (m) m.call(observer);
        break;
    }
  } catch (e) {
    hostReportError(e);
  }

  if (subscription._state === 'closed') cleanupSubscription(subscription);else if (subscription._state === 'running') subscription._state = 'ready';
}

function onNotify(subscription, type, value) {
  if (subscription._state === 'closed') return;

  if (subscription._state === 'buffering') {
    subscription._queue.push({ type: type, value: value });
    return;
  }

  if (subscription._state !== 'ready') {
    subscription._state = 'buffering';
    subscription._queue = [{ type: type, value: value }];
    enqueue(function () {
      return flushSubscription(subscription);
    });
    return;
  }

  notifySubscription(subscription, type, value);
}

var Subscription = function () {
  function Subscription(observer, subscriber) {
    _classCallCheck(this, Subscription);

    // ASSERT: observer is an object
    // ASSERT: subscriber is callable

    this._cleanup = undefined;
    this._observer = observer;
    this._queue = undefined;
    this._state = 'initializing';

    var subscriptionObserver = new SubscriptionObserver(this);

    try {
      this._cleanup = subscriber.call(undefined, subscriptionObserver);
    } catch (e) {
      subscriptionObserver.error(e);
    }

    if (this._state === 'initializing') this._state = 'ready';
  }

  _createClass(Subscription, [{
    key: 'unsubscribe',
    value: function unsubscribe() {
      if (this._state !== 'closed') {
        closeSubscription(this);
        cleanupSubscription(this);
      }
    }
  }, {
    key: 'closed',
    get: function () {
      return this._state === 'closed';
    }
  }]);

  return Subscription;
}();

var SubscriptionObserver = function () {
  function SubscriptionObserver(subscription) {
    _classCallCheck(this, SubscriptionObserver);

    this._subscription = subscription;
  }

  _createClass(SubscriptionObserver, [{
    key: 'next',
    value: function next(value) {
      onNotify(this._subscription, 'next', value);
    }
  }, {
    key: 'error',
    value: function error(value) {
      onNotify(this._subscription, 'error', value);
    }
  }, {
    key: 'complete',
    value: function complete() {
      onNotify(this._subscription, 'complete');
    }
  }, {
    key: 'closed',
    get: function () {
      return this._subscription._state === 'closed';
    }
  }]);

  return SubscriptionObserver;
}();

var Observable = exports.Observable = function () {
  function Observable(subscriber) {
    _classCallCheck(this, Observable);

    if (!(this instanceof Observable)) throw new TypeError('Observable cannot be called as a function');

    if (typeof subscriber !== 'function') throw new TypeError('Observable initializer must be a function');

    this._subscriber = subscriber;
  }

  _createClass(Observable, [{
    key: 'subscribe',
    value: function subscribe(observer) {
      if (typeof observer !== 'object' || observer === null) {
        observer = {
          next: observer,
          error: arguments[1],
          complete: arguments[2]
        };
      }
      return new Subscription(observer, this._subscriber);
    }
  }, {
    key: 'forEach',
    value: function forEach(fn) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (typeof fn !== 'function') {
          reject(new TypeError(fn + ' is not a function'));
          return;
        }

        function done() {
          subscription.unsubscribe();
          resolve();
        }

        var subscription = _this.subscribe({
          next: function (value) {
            try {
              fn(value, done);
            } catch (e) {
              reject(e);
              subscription.unsubscribe();
            }
          },

          error: reject,
          complete: resolve
        });
      });
    }
  }, {
    key: 'map',
    value: function map(fn) {
      var _this2 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

      var C = getSpecies(this);

      return new C(function (observer) {
        return _this2.subscribe({
          next: function (value) {
            try {
              value = fn(value);
            } catch (e) {
              return observer.error(e);
            }
            observer.next(value);
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            observer.complete();
          }
        });
      });
    }
  }, {
    key: 'filter',
    value: function filter(fn) {
      var _this3 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

      var C = getSpecies(this);

      return new C(function (observer) {
        return _this3.subscribe({
          next: function (value) {
            try {
              if (!fn(value)) return;
            } catch (e) {
              return observer.error(e);
            }
            observer.next(value);
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            observer.complete();
          }
        });
      });
    }
  }, {
    key: 'reduce',
    value: function reduce(fn) {
      var _this4 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

      var C = getSpecies(this);
      var hasSeed = arguments.length > 1;
      var hasValue = false;
      var seed = arguments[1];
      var acc = seed;

      return new C(function (observer) {
        return _this4.subscribe({
          next: function (value) {
            var first = !hasValue;
            hasValue = true;

            if (!first || hasSeed) {
              try {
                acc = fn(acc, value);
              } catch (e) {
                return observer.error(e);
              }
            } else {
              acc = value;
            }
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            if (!hasValue && !hasSeed) return observer.error(new TypeError('Cannot reduce an empty sequence'));

            observer.next(acc);
            observer.complete();
          }
        });
      });
    }
  }, {
    key: 'concat',
    value: function concat() {
      var _this5 = this;

      for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
        sources[_key] = arguments[_key];
      }

      var C = getSpecies(this);

      return new C(function (observer) {
        var subscription = void 0;
        var index = 0;

        function startNext(next) {
          subscription = next.subscribe({
            next: function (v) {
              observer.next(v);
            },
            error: function (e) {
              observer.error(e);
            },
            complete: function () {
              if (index === sources.length) {
                subscription = undefined;
                observer.complete();
              } else {
                startNext(C.from(sources[index++]));
              }
            }
          });
        }

        startNext(_this5);

        return function () {
          if (subscription) {
            subscription.unsubscribe();
            subscription = undefined;
          }
        };
      });
    }
  }, {
    key: 'flatMap',
    value: function flatMap(fn) {
      var _this6 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

      var C = getSpecies(this);

      return new C(function (observer) {
        var subscriptions = [];

        var outer = _this6.subscribe({
          next: function (value) {
            if (fn) {
              try {
                value = fn(value);
              } catch (e) {
                return observer.error(e);
              }
            }

            var inner = C.from(value).subscribe({
              next: function (value) {
                observer.next(value);
              },
              error: function (e) {
                observer.error(e);
              },
              complete: function () {
                var i = subscriptions.indexOf(inner);
                if (i >= 0) subscriptions.splice(i, 1);
                completeIfDone();
              }
            });

            subscriptions.push(inner);
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            completeIfDone();
          }
        });

        function completeIfDone() {
          if (outer.closed && subscriptions.length === 0) observer.complete();
        }

        return function () {
          subscriptions.forEach(function (s) {
            return s.unsubscribe();
          });
          outer.unsubscribe();
        };
      });
    }
  }, {
    key: SymbolObservable,
    value: function () {
      return this;
    }
  }], [{
    key: 'from',
    value: function from(x) {
      var C = typeof this === 'function' ? this : Observable;

      if (x == null) throw new TypeError(x + ' is not an object');

      var method = getMethod(x, SymbolObservable);
      if (method) {
        var observable = method.call(x);

        if (Object(observable) !== observable) throw new TypeError(observable + ' is not an object');

        if (isObservable(observable) && observable.constructor === C) return observable;

        return new C(function (observer) {
          return observable.subscribe(observer);
        });
      }

      if (hasSymbol('iterator')) {
        method = getMethod(x, SymbolIterator);
        if (method) {
          return new C(function (observer) {
            enqueue(function () {
              if (observer.closed) return;
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = method.call(x)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var item = _step.value;

                  observer.next(item);
                  if (observer.closed) return;
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              observer.complete();
            });
          });
        }
      }

      if (Array.isArray(x)) {
        return new C(function (observer) {
          enqueue(function () {
            if (observer.closed) return;
            for (var i = 0; i < x.length; ++i) {
              observer.next(x[i]);
              if (observer.closed) return;
            }
            observer.complete();
          });
        });
      }

      throw new TypeError(x + ' is not observable');
    }
  }, {
    key: 'of',
    value: function of() {
      for (var _len2 = arguments.length, items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        items[_key2] = arguments[_key2];
      }

      var C = typeof this === 'function' ? this : Observable;

      return new C(function (observer) {
        enqueue(function () {
          if (observer.closed) return;
          for (var i = 0; i < items.length; ++i) {
            observer.next(items[i]);
            if (observer.closed) return;
          }
          observer.complete();
        });
      });
    }
  }, {
    key: SymbolSpecies,
    get: function () {
      return this;
    }
  }]);

  return Observable;
}();

if (hasSymbols()) {
  Object.defineProperty(Observable, Symbol('extensions'), {
    value: {
      symbol: SymbolObservable,
      hostReportError: hostReportError
    },
    configurable: true
  });
}
},{}],"U0NN":[function(require,module,exports) {
module.exports = require('./lib/Observable.js').Observable;

},{"./lib/Observable.js":"AVeU"}],"TLss":[function(require,module,exports) {
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export = require('./_export');
var $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');

},{"./_export":"izCb","./_array-includes":"4Ca7","./_add-to-unscopables":"Z7e/"}],"6WEV":[function(require,module,exports) {
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_is-object":"M7z6","./_cof":"Z5df","./_wks":"44AI"}],"GbTB":[function(require,module,exports) {
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_is-regexp":"6WEV","./_defined":"+Bjj"}],"Ah+n":[function(require,module,exports) {
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":"44AI"}],"fH7p":[function(require,module,exports) {
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = require('./_export');
var context = require('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":"izCb","./_string-context":"GbTB","./_fails-is-regexp":"Ah+n"}],"IxO8":[function(require,module,exports) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],"fwAU":[function(require,module,exports) {
var defineProperty = require("./defineProperty");

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      defineProperty(target, key, source[key]);
    });
  }

  return target;
}

module.exports = _objectSpread;
},{"./defineProperty":"IxO8"}],"t2zx":[function(require,module,exports) {
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;
},{}],"U8F3":[function(require,module,exports) {
var objectWithoutPropertiesLoose = require("./objectWithoutPropertiesLoose");

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;
},{"./objectWithoutPropertiesLoose":"t2zx"}],"LvRh":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-includes":"4Ca7","./_strict-method":"2Hh2"}],"zTqj":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unobserveOrCancel = exports.unobserve = exports.toObservable = exports.send = exports.observe = exports.create = exports.cancel = void 0;

require("core-js/modules/es6.array.find-index");

require("core-js/modules/es6.array.find");

require("core-js/modules/es6.function.name");

var _utilsComposite = require("@jumpn/utils-composite");

require("phoenix");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _utilsGraphql = require("@jumpn/utils-graphql");

var _zenObservable = _interopRequireDefault(require("zen-observable"));

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

require("core-js/modules/es6.array.index-of");

var _utilsArray = require("@jumpn/utils-array");

require("core-js/modules/es6.function.bind");

var _newArrowCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/newArrowCheck"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _this = undefined;

var cancel = function cancel(_ref) {
  var activeObservers = _ref.activeObservers,
      canceledObservers = _ref.canceledObservers,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["activeObservers", "canceledObservers"]);
  (0, _newArrowCheck2.default)(this, _this);
  return (0, _objectSpread2.default)({}, rest, {
    isActive: false,
    activeObservers: [],
    canceledObservers: (0, _toConsumableArray2.default)(activeObservers).concat((0, _toConsumableArray2.default)(canceledObservers))
  });
}.bind(undefined);

var _this$1 = undefined;

var getNotifier = function getNotifier(handlerName, payload) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$1);
  return function (observer) {
    (0, _newArrowCheck2.default)(this, _this2);
    return observer[handlerName] && observer[handlerName](payload);
  }.bind(this);
}.bind(undefined);

var getHandlerName = function getHandlerName(_ref) {
  var name = _ref.name;
  (0, _newArrowCheck2.default)(this, _this$1);
  return "on".concat(name);
}.bind(undefined);

var notifyAll = function notifyAll(observers, event) {
  (0, _newArrowCheck2.default)(this, _this$1);
  return observers.forEach(getNotifier(getHandlerName(event), event.payload));
}.bind(undefined);

var _this$2 = undefined;

var notifyCanceled = function notifyCanceled(notifier, event) {
  (0, _newArrowCheck2.default)(this, _this$2);
  notifyAll(notifier.canceledObservers, event);
  return notifier;
}.bind(undefined);

var eventNames = {
  abort: "Abort",
  cancel: "Cancel",
  error: "Error",
  result: "Result",
  start: "Start"
};
var _this$3 = undefined;

var createStartEvent = function createStartEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    payload: payload,
    name: eventNames.start
  };
}.bind(undefined);

var createResultEvent = function createResultEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    payload: payload,
    name: eventNames.result
  };
}.bind(undefined);

var createErrorEvent = function createErrorEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    payload: payload,
    name: eventNames.error
  };
}.bind(undefined);

var createCancelEvent = function createCancelEvent() {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    name: eventNames.cancel,
    payload: undefined
  };
}.bind(undefined);

var createAbortEvent = function createAbortEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    payload: payload,
    name: eventNames.abort
  };
}.bind(undefined);

var _this$4 = undefined;

var clearCanceled = function clearCanceled(notifier) {
  (0, _newArrowCheck2.default)(this, _this$4);
  return (0, _objectSpread2.default)({}, notifier, {
    canceledObservers: []
  });
}.bind(undefined);

var flushCanceled = function flushCanceled(notifier) {
  (0, _newArrowCheck2.default)(this, _this$4);
  return notifier.canceledObservers.length > 0 ? clearCanceled(notifyCanceled(notifier, createCancelEvent())) : notifier;
}.bind(undefined);

var _this$5 = undefined;

var findIndex = function findIndex(notifiers, key, value // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
) {
  (0, _newArrowCheck2.default)(this, _this$5);
  return notifiers.findIndex((0, _utilsComposite.hasIn)([key], value));
}.bind(undefined);

var _this$6 = undefined;

var refresh = function refresh(notifier) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$6);
  return function (notifiers) {
    (0, _newArrowCheck2.default)(this, _this2);
    return (0, _utilsArray.replace)(findIndex(notifiers, "request", notifier.request), [notifier], notifiers);
  }.bind(this);
}.bind(undefined);

var _this$7 = undefined;

var remove$1 = function remove$$1(notifier) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$7);
  return function (notifiers) {
    (0, _newArrowCheck2.default)(this, _this2);
    return (0, _utilsArray.remove)(findIndex(notifiers, "request", notifier.request), 1, notifiers);
  }.bind(this);
}.bind(undefined);

var _this$8 = undefined;

var updateNotifiers = function updateNotifiers(absintheSocket, updater) {
  (0, _newArrowCheck2.default)(this, _this$8);
  absintheSocket.notifiers = updater(absintheSocket.notifiers);
  return absintheSocket;
}.bind(undefined);

var _this$9 = undefined;

var refreshNotifier = function refreshNotifier(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$9);
  updateNotifiers(absintheSocket, refresh(notifier));
  return notifier;
}.bind(undefined);

var requestStatuses = {
  canceled: "canceled",
  canceling: "canceling",
  pending: "pending",
  sent: "sent",
  sending: "sending"
};
var _this$a = undefined;

var getObservers = function getObservers(_ref) {
  var activeObservers = _ref.activeObservers,
      canceledObservers = _ref.canceledObservers;
  (0, _newArrowCheck2.default)(this, _this$a);
  return (0, _toConsumableArray2.default)(activeObservers).concat((0, _toConsumableArray2.default)(canceledObservers));
}.bind(undefined);

var notify = function notify(notifier, event) {
  (0, _newArrowCheck2.default)(this, _this$a);
  notifyAll(getObservers(notifier), event);
  return notifier;
}.bind(undefined);

var _this$b = undefined;

var abortNotifier = function abortNotifier(absintheSocket, notifier, error) {
  (0, _newArrowCheck2.default)(this, _this$b);
  return updateNotifiers(absintheSocket, remove$1(notify(notifier, createAbortEvent(error))));
}.bind(undefined);

var _this$c = undefined;

var find = function find(notifiers, key, value // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
) {
  (0, _newArrowCheck2.default)(this, _this$c);
  return notifiers.find((0, _utilsComposite.hasIn)([key], value));
}.bind(undefined);

var _this$d = undefined;

var notifyActive = function notifyActive(notifier, event) {
  (0, _newArrowCheck2.default)(this, _this$d);
  notifyAll(notifier.activeObservers, event);
  return notifier;
}.bind(undefined);

var _this$e = undefined;

var notifyResultEvent = function notifyResultEvent(notifier, result) {
  (0, _newArrowCheck2.default)(this, _this$e);
  return notifyActive(notifier, createResultEvent(result));
}.bind(undefined);

var _this$f = undefined;

var notifyStartEvent = function notifyStartEvent(notifier) {
  (0, _newArrowCheck2.default)(this, _this$f);
  return notifyActive(notifier, createStartEvent(notifier));
}.bind(undefined);

var _this$g = undefined;

var reset = function reset(notifier) {
  (0, _newArrowCheck2.default)(this, _this$g);
  return flushCanceled((0, _objectSpread2.default)({}, notifier, {
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined
  }));
}.bind(undefined);

var _this$h = undefined;

var handlePush = function handlePush(push, handler) {
  (0, _newArrowCheck2.default)(this, _this$h);
  return push.receive("ok", handler.onSucceed).receive("error", handler.onError).receive("timeout", handler.onTimeout);
}.bind(undefined);

var _this$i = undefined;

var getPushHandlerMethodGetter = function getPushHandlerMethodGetter(absintheSocket, request) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$i);
  return function (handle) {
    var _this3 = this;

    (0, _newArrowCheck2.default)(this, _this2);
    return function () {
      (0, _newArrowCheck2.default)(this, _this3);
      var notifier = find(absintheSocket.notifiers, "request", request);

      if (notifier) {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        handle.apply(void 0, [absintheSocket, notifier].concat(args));
      }
    }.bind(this);
  }.bind(this);
}.bind(undefined);

var getPushHandler = function getPushHandler(absintheSocket, request, notifierPushHandler) {
  (0, _newArrowCheck2.default)(this, _this$i);
  return (0, _utilsComposite.map)(getPushHandlerMethodGetter(absintheSocket, request), notifierPushHandler);
}.bind(undefined);

var pushAbsintheEvent = function pushAbsintheEvent(absintheSocket, request, notifierPushHandler, absintheEvent) {
  (0, _newArrowCheck2.default)(this, _this$i);
  handlePush(absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload), getPushHandler(absintheSocket, request, notifierPushHandler));
  return absintheSocket;
}.bind(undefined);

var absintheEventNames = {
  doc: "doc",
  unsubscribe: "unsubscribe"
};
var _this$j = undefined;

var createAbsintheUnsubscribeEvent = function createAbsintheUnsubscribeEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$j);
  return {
    payload: payload,
    name: absintheEventNames.unsubscribe
  };
}.bind(undefined);

var createAbsintheDocEvent = function createAbsintheDocEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$j);
  return {
    payload: payload,
    name: absintheEventNames.doc
  };
}.bind(undefined);

var _this$k = undefined;

var pushAbsintheDocEvent = function pushAbsintheDocEvent(absintheSocket, _ref, notifierPushHandler) {
  var request = _ref.request;
  (0, _newArrowCheck2.default)(this, _this$k);
  return pushAbsintheEvent(absintheSocket, request, notifierPushHandler, createAbsintheDocEvent((0, _utilsGraphql.requestToCompat)(request)));
}.bind(undefined);

var setNotifierRequestStatusSending = function setNotifierRequestStatusSending(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return refreshNotifier(absintheSocket, (0, _objectSpread2.default)({}, notifier, {
    requestStatus: requestStatuses.sending
  }));
}.bind(undefined);

var createRequestError = function createRequestError(message) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return new Error("request: ".concat(message));
}.bind(undefined);

var onTimeout = function onTimeout(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return notifyActive(notifier, createErrorEvent(createRequestError("timeout")));
}.bind(undefined);

var onError = function onError(absintheSocket, notifier, errorMessage) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return abortNotifier(absintheSocket, notifier, createRequestError(errorMessage));
}.bind(undefined);

var getNotifierPushHandler = function getNotifierPushHandler(onSucceed) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return {
    onError: onError,
    onSucceed: onSucceed,
    onTimeout: onTimeout
  };
}.bind(undefined);

var pushRequestUsing = function pushRequestUsing(absintheSocket, notifier, onSucceed) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return pushAbsintheDocEvent(absintheSocket, setNotifierRequestStatusSending(absintheSocket, notifier), getNotifierPushHandler(onSucceed));
}.bind(undefined);

var _this$l = undefined;

var onUnsubscribeSucceedCanceled = function onUnsubscribeSucceedCanceled(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return updateNotifiers(absintheSocket, remove$1(flushCanceled(notifier)));
}.bind(undefined);

var onUnsubscribeSucceedActive = function onUnsubscribeSucceedActive(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return subscribe(absintheSocket, refreshNotifier(absintheSocket, reset(notifier)));
}.bind(undefined);

var createUnsubscribeError = function createUnsubscribeError(message) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return new Error("unsubscribe: ".concat(message));
}.bind(undefined);

var unsubscribeHandler = {
  onError: function onError$$1(absintheSocket, notifier, errorMessage) {
    (0, _newArrowCheck2.default)(this, _this$l);
    return abortNotifier(absintheSocket, notifier, createUnsubscribeError(errorMessage));
  }.bind(undefined),
  onTimeout: function onTimeout(absintheSocket, notifier) {
    (0, _newArrowCheck2.default)(this, _this$l);
    return notifyCanceled(notifier, createErrorEvent(createUnsubscribeError("timeout")));
  }.bind(undefined),
  onSucceed: function onSucceed(absintheSocket, notifier) {
    (0, _newArrowCheck2.default)(this, _this$l);

    if (notifier.isActive) {
      onUnsubscribeSucceedActive(absintheSocket, notifier);
    } else {
      onUnsubscribeSucceedCanceled(absintheSocket, notifier);
    }
  }.bind(undefined)
};

var pushAbsintheUnsubscribeEvent = function pushAbsintheUnsubscribeEvent(absintheSocket, _ref) {
  var request = _ref.request,
      subscriptionId = _ref.subscriptionId;
  (0, _newArrowCheck2.default)(this, _this$l);
  return pushAbsintheEvent(absintheSocket, request, unsubscribeHandler, createAbsintheUnsubscribeEvent({
    subscriptionId: subscriptionId
  }));
}.bind(undefined);

var unsubscribe = function unsubscribe(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return pushAbsintheUnsubscribeEvent(absintheSocket, refreshNotifier(absintheSocket, (0, _objectSpread2.default)({}, notifier, {
    requestStatus: requestStatuses.canceling
  })));
}.bind(undefined);

var onSubscribeSucceed = function onSubscribeSucceed(absintheSocket, notifier, _ref2) {
  var subscriptionId = _ref2.subscriptionId;
  (0, _newArrowCheck2.default)(this, _this$l);
  var subscribedNotifier = refreshNotifier(absintheSocket, (0, _objectSpread2.default)({}, notifier, {
    subscriptionId: subscriptionId,
    requestStatus: requestStatuses.sent
  }));

  if (subscribedNotifier.isActive) {
    notifyStartEvent(subscribedNotifier);
  } else {
    unsubscribe(absintheSocket, subscribedNotifier);
  }
}.bind(undefined);

var onSubscribe = function onSubscribe(absintheSocket, notifier, response) {
  (0, _newArrowCheck2.default)(this, _this$l);

  if (response.errors) {
    onError(absintheSocket, notifier, (0, _utilsGraphql.errorsToString)(response.errors));
  } else {
    onSubscribeSucceed(absintheSocket, notifier, response);
  }
}.bind(undefined);

var subscribe = function subscribe(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return pushRequestUsing(absintheSocket, notifier, onSubscribe);
}.bind(undefined);

var onDataMessage = function onDataMessage(absintheSocket, _ref3) {
  var payload = _ref3.payload;
  (0, _newArrowCheck2.default)(this, _this$l);
  var notifier = find(absintheSocket.notifiers, "subscriptionId", payload.subscriptionId);

  if (notifier) {
    notifyResultEvent(notifier, payload.result);
  }
}.bind(undefined);

var dataMessageEventName = "subscription:data";

var isDataMessage = function isDataMessage(message) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return message.event === dataMessageEventName;
}.bind(undefined);

var _this$m = undefined;

var cancelQueryOrMutationSending = function cancelQueryOrMutationSending(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return updateNotifiers(absintheSocket, refresh(flushCanceled(cancel(notifier))));
}.bind(undefined);

var cancelQueryOrMutationIfSending = function cancelQueryOrMutationIfSending(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.requestStatus === requestStatuses.sending ? cancelQueryOrMutationSending(absintheSocket, notifier) : absintheSocket;
}.bind(undefined);

var cancelPending = function cancelPending(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return updateNotifiers(absintheSocket, remove$1(flushCanceled(cancel(notifier))));
}.bind(undefined);

var cancelQueryOrMutation = function cancelQueryOrMutation(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.requestStatus === requestStatuses.pending ? cancelPending(absintheSocket, notifier) : cancelQueryOrMutationIfSending(absintheSocket, notifier);
}.bind(undefined);

var unsubscribeIfNeeded = function unsubscribeIfNeeded(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.requestStatus === requestStatuses.sent ? unsubscribe(absintheSocket, notifier) : absintheSocket;
}.bind(undefined);

var cancelNonPendingSubscription = function cancelNonPendingSubscription(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return unsubscribeIfNeeded(absintheSocket, refreshNotifier(absintheSocket, cancel(notifier)));
}.bind(undefined);

var cancelSubscription = function cancelSubscription(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.requestStatus === requestStatuses.pending ? cancelPending(absintheSocket, notifier) : cancelNonPendingSubscription(absintheSocket, notifier);
}.bind(undefined);

var cancelActive = function cancelActive(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.operationType === "subscription" ? cancelSubscription(absintheSocket, notifier) : cancelQueryOrMutation(absintheSocket, notifier);
}.bind(undefined);
/**
 * Cancels a notifier sending a Cancel event to all its observers and
 * unsubscribing in case it holds a subscription request
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.cancel(absintheSocket, notifier);
 */


var cancel$1 = function cancel$$1(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.isActive ? cancelActive(absintheSocket, notifier) : absintheSocket;
}.bind(undefined);

exports.cancel = cancel$1;
var _this$n = undefined;

var setNotifierRequestStatusSent = function setNotifierRequestStatusSent(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$n);
  return refreshNotifier(absintheSocket, (0, _objectSpread2.default)({}, notifier, {
    requestStatus: requestStatuses.sent
  }));
}.bind(undefined);

var onQueryOrMutationSucceed = function onQueryOrMutationSucceed(absintheSocket, notifier, response) {
  (0, _newArrowCheck2.default)(this, _this$n);
  return updateNotifiers(absintheSocket, remove$1(notifyResultEvent(setNotifierRequestStatusSent(absintheSocket, notifier), response)));
}.bind(undefined);

var pushQueryOrMutation = function pushQueryOrMutation(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$n);
  return pushRequestUsing(absintheSocket, notifyStartEvent(notifier), onQueryOrMutationSucceed);
}.bind(undefined);

var pushRequest = function pushRequest(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$n);

  if (notifier.operationType === "subscription") {
    subscribe(absintheSocket, notifier);
  } else {
    pushQueryOrMutation(absintheSocket, notifier);
  }
}.bind(undefined);

var _this$o = undefined;

var createChannelJoinError = function createChannelJoinError(message) {
  (0, _newArrowCheck2.default)(this, _this$o);
  return new Error("channel join: ".concat(message));
}.bind(undefined);

var notifyErrorToAllActive = function notifyErrorToAllActive(absintheSocket, errorMessage) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$o);
  return absintheSocket.notifiers.forEach(function (notifier) {
    (0, _newArrowCheck2.default)(this, _this2);
    return notifyActive(notifier, createErrorEvent(createChannelJoinError(errorMessage)));
  }.bind(this));
}.bind(undefined); // join Push is reused and so the handler
// https://github.com/phoenixframework/phoenix/blob/master/assets/js/phoenix.js#L356


var createChannelJoinHandler = function createChannelJoinHandler(absintheSocket) {
  var _this3 = this;

  (0, _newArrowCheck2.default)(this, _this$o);
  return {
    onError: function onError(errorMessage) {
      (0, _newArrowCheck2.default)(this, _this3);
      return notifyErrorToAllActive(absintheSocket, errorMessage);
    }.bind(this),
    onSucceed: function onSucceed() {
      var _this4 = this;

      (0, _newArrowCheck2.default)(this, _this3);
      return absintheSocket.notifiers.forEach(function (notifier) {
        (0, _newArrowCheck2.default)(this, _this4);
        return pushRequest(absintheSocket, notifier);
      }.bind(this));
    }.bind(this),
    onTimeout: function onTimeout() {
      (0, _newArrowCheck2.default)(this, _this3);
      return notifyErrorToAllActive(absintheSocket, "timeout");
    }.bind(this)
  };
}.bind(undefined);

var joinChannel = function joinChannel(absintheSocket) {
  (0, _newArrowCheck2.default)(this, _this$o);
  handlePush(absintheSocket.channel.join(), createChannelJoinHandler(absintheSocket));
  absintheSocket.channelJoinCreated = true;
  return absintheSocket;
}.bind(undefined);

var _this$p = undefined;

var onMessage = function onMessage(absintheSocket) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$p);
  return function (message) {
    (0, _newArrowCheck2.default)(this, _this2);

    if (isDataMessage(message)) {
      onDataMessage(absintheSocket, message);
    }
  }.bind(this);
}.bind(undefined);

var createConnectionCloseError = function createConnectionCloseError() {
  (0, _newArrowCheck2.default)(this, _this$p);
  return new Error("connection: close");
}.bind(undefined);

var notifyConnectionCloseError = function notifyConnectionCloseError(notifier) {
  (0, _newArrowCheck2.default)(this, _this$p);
  return notify(notifier, createErrorEvent(createConnectionCloseError()));
}.bind(undefined);

var notifierOnConnectionCloseCanceled = function notifierOnConnectionCloseCanceled(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$p);
  return updateNotifiers(absintheSocket, remove$1(notifyConnectionCloseError(notifier)));
}.bind(undefined);

var notifierOnConnectionCloseActive = function notifierOnConnectionCloseActive(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$p);

  if (notifier.operationType === "mutation") {
    abortNotifier(absintheSocket, notifier, createConnectionCloseError());
  } else {
    refreshNotifier(absintheSocket, reset(notifyConnectionCloseError(notifier)));
  }
}.bind(undefined);

var notifierOnConnectionClose = function notifierOnConnectionClose(absintheSocket) {
  var _this3 = this;

  (0, _newArrowCheck2.default)(this, _this$p);
  return function (notifier) {
    (0, _newArrowCheck2.default)(this, _this3);

    if (notifier.isActive) {
      notifierOnConnectionCloseActive(absintheSocket, notifier);
    } else {
      notifierOnConnectionCloseCanceled(absintheSocket, notifier);
    }
  }.bind(this);
}.bind(undefined);

var onConnectionClose = function onConnectionClose(absintheSocket) {
  var _this4 = this;

  (0, _newArrowCheck2.default)(this, _this$p);
  return function () {
    (0, _newArrowCheck2.default)(this, _this4);
    return absintheSocket.notifiers.forEach(notifierOnConnectionClose(absintheSocket));
  }.bind(this);
}.bind(undefined);

var shouldJoinChannel = function shouldJoinChannel(absintheSocket) {
  (0, _newArrowCheck2.default)(this, _this$p);
  return !absintheSocket.channelJoinCreated && absintheSocket.notifiers.length > 0;
}.bind(undefined);

var onConnectionOpen = function onConnectionOpen(absintheSocket) {
  var _this5 = this;

  (0, _newArrowCheck2.default)(this, _this$p);
  return function () {
    (0, _newArrowCheck2.default)(this, _this5);

    if (shouldJoinChannel(absintheSocket)) {
      joinChannel(absintheSocket);
    }
  }.bind(this);
}.bind(undefined);

var absintheChannelName = "__absinthe__:control";
/**
 * Creates an Absinthe Socket using the given Phoenix Socket instance
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 * import {Socket as PhoenixSocket} from "phoenix";

 * const absintheSocket = withAbsintheSocket.create(
 *   new PhoenixSocket("ws://localhost:4000/socket")
 * );
 */

var create = function create(phoenixSocket) {
  (0, _newArrowCheck2.default)(this, _this$p);
  var absintheSocket = {
    phoenixSocket: phoenixSocket,
    channel: phoenixSocket.channel(absintheChannelName),
    channelJoinCreated: false,
    notifiers: []
  };
  phoenixSocket.onOpen(onConnectionOpen(absintheSocket));
  phoenixSocket.onClose(onConnectionClose(absintheSocket));
  phoenixSocket.onMessage(onMessage(absintheSocket));
  return absintheSocket;
}.bind(undefined);

exports.create = create;
var _this$q = undefined;

var observe = function observe(_ref, observer) {
  var activeObservers = _ref.activeObservers,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["activeObservers"]);
  (0, _newArrowCheck2.default)(this, _this$q);
  return (0, _objectSpread2.default)({}, rest, {
    activeObservers: (0, _toConsumableArray2.default)(activeObservers).concat([observer]),
    isActive: true
  });
}.bind(undefined);

var _this$r = undefined;
/**
 * Observes given notifier using the provided observer
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket"
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const updatedNotifier = withAbsintheSocket.observe(absintheSocket, notifier, {
 *   onAbort: logEvent("abort"),
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   onResult: logEvent("result")
 * });
 */

var observe$1 = function observe$$1(absintheSocket, notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$r);
  return refreshNotifier(absintheSocket, observe(notifier, observer));
}.bind(undefined);

exports.observe = observe$1;
var _this$s = undefined;

var createUsing = function createUsing(request, operationType) {
  (0, _newArrowCheck2.default)(this, _this$s);
  return {
    operationType: operationType,
    request: request,
    activeObservers: [],
    canceledObservers: [],
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined
  };
}.bind(undefined);

var create$1 = function create(request) {
  (0, _newArrowCheck2.default)(this, _this$s);
  return createUsing(request, (0, _utilsGraphql.getOperationType)(request.operation));
}.bind(undefined);

var _this$t = undefined;

var reactivate = function reactivate(notifier) {
  (0, _newArrowCheck2.default)(this, _this$t);
  return notifier.isActive ? notifier : (0, _objectSpread2.default)({}, notifier, {
    isActive: true
  });
}.bind(undefined);

var _this$u = undefined;

var connectOrJoinChannel = function connectOrJoinChannel(absintheSocket) {
  (0, _newArrowCheck2.default)(this, _this$u);

  if (absintheSocket.phoenixSocket.isConnected()) {
    joinChannel(absintheSocket);
  } else {
    // socket ignores connect calls if a connection has already been created
    absintheSocket.phoenixSocket.connect();
  }
}.bind(undefined);

var sendNew = function sendNew(absintheSocket, request) {
  (0, _newArrowCheck2.default)(this, _this$u);
  var notifier = create$1(request);
  updateNotifiers(absintheSocket, (0, _utilsArray.append)([notifier]));

  if (absintheSocket.channelJoinCreated) {
    pushRequest(absintheSocket, notifier);
  } else {
    connectOrJoinChannel(absintheSocket);
  }

  return notifier;
}.bind(undefined);

var updateCanceledReactivate = function updateCanceledReactivate(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$u);
  return refreshNotifier(absintheSocket, reactivate(notifier));
}.bind(undefined);

var updateCanceled = function updateCanceled(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$u);
  return notifier.requestStatus === requestStatuses.sending ? updateCanceledReactivate(absintheSocket, flushCanceled(notifier)) : updateCanceledReactivate(absintheSocket, notifier);
}.bind(undefined);

var updateIfCanceled = function updateIfCanceled(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$u);
  return notifier.isActive ? notifier : updateCanceled(absintheSocket, notifier);
}.bind(undefined);

var getExistentIfAny = function getExistentIfAny(absintheSocket, request) {
  (0, _newArrowCheck2.default)(this, _this$u);
  var notifier = find(absintheSocket.notifiers, "request", request);
  return notifier && updateIfCanceled(absintheSocket, notifier);
}.bind(undefined);
/**
 * Sends given request and returns an object (notifier) to track its progress
 * (see observe function)
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * const operation = `
 *   subscription userSubscription($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * // This example uses a subscription, but the functionallity is the same for
 * // all operation types (queries, mutations and subscriptions)
 *
 * const notifier = withAbsintheSocket.send(absintheSocket, {
 *   operation,
 *   variables: {userId: 10}
 * });
 */


var send = function send(absintheSocket, request) {
  (0, _newArrowCheck2.default)(this, _this$u);
  return getExistentIfAny(absintheSocket, request) || sendNew(absintheSocket, request);
}.bind(undefined);

exports.send = send;
var _this$v = undefined; // prettier-ignore

var getUnsubscriber = function getUnsubscriber(absintheSocket, _ref, observer, unsubscribe) {
  var _this2 = this;

  var request = _ref.request;
  (0, _newArrowCheck2.default)(this, _this$v);
  return function () {
    (0, _newArrowCheck2.default)(this, _this2);
    var notifier = find(absintheSocket.notifiers, "request", request);
    unsubscribe(absintheSocket, notifier, notifier ? observer : undefined);
  }.bind(this);
}.bind(undefined);

var onResult = function onResult(_ref2, observableObserver) {
  var _this3 = this;

  var operationType = _ref2.operationType;
  (0, _newArrowCheck2.default)(this, _this$v);
  return function (result) {
    (0, _newArrowCheck2.default)(this, _this3);
    observableObserver.next(result);

    if (operationType !== "subscription") {
      observableObserver.complete();
    }
  }.bind(this);
}.bind(undefined);

var createObserver = function createObserver(notifier, handlers, observableObserver) {
  (0, _newArrowCheck2.default)(this, _this$v);
  return (0, _objectSpread2.default)({}, handlers, {
    onAbort: observableObserver.error.bind(observableObserver),
    onResult: onResult(notifier, observableObserver)
  });
}.bind(undefined);
/**
 * Creates an Observable that will follow the given notifier
 *
 * @param {AbsintheSocket} absintheSocket
 * @param {Notifier<Result, Variables>} notifier
 * @param {Object} [options]
 * @param {function(error: Error): undefined} [options.onError]
 * @param {function(notifier: Notifier<Result, Variables>): undefined} [options.onStart]
 * @param {function(): undefined} [options.unsubscribe]
 *
 * @return {Observable}
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * const unobserveOrCancelIfNeeded = (absintheSocket, notifier, observer) => {
 *   if (notifier && observer) {
 *     withAbsintheSocket.unobserveOrCancel(absintheSocket, notifier, observer);
 *   }
 * };
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const observable = withAbsintheSocket.toObservable(absintheSocket, notifier, {
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   unsubscribe: unobserveOrCancelIfNeeded
 * });
 */


var toObservable = function toObservable(absintheSocket, notifier) {
  var _this4 = this;

  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      unsubscribe = _ref3.unsubscribe,
      handlers = (0, _objectWithoutProperties2.default)(_ref3, ["unsubscribe"]);

  (0, _newArrowCheck2.default)(this, _this$v);
  return new _zenObservable.default(function (observableObserver) {
    (0, _newArrowCheck2.default)(this, _this4);
    var observer = createObserver(notifier, handlers, observableObserver);
    observe$1(absintheSocket, notifier, observer);
    return unsubscribe && getUnsubscriber(absintheSocket, notifier, observer, unsubscribe);
  }.bind(this));
}.bind(undefined);

exports.toObservable = toObservable;
var _this$w = undefined;

var removeObserver = function removeObserver(observers, observer) {
  (0, _newArrowCheck2.default)(this, _this$w);
  return (0, _utilsArray.remove)(observers.indexOf(observer), 1, observers);
}.bind(undefined);

var unobserve = function unobserve(_ref, observer) {
  var activeObservers = _ref.activeObservers,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["activeObservers"]);
  (0, _newArrowCheck2.default)(this, _this$w);
  return (0, _objectSpread2.default)({}, rest, {
    activeObservers: removeObserver(activeObservers, observer)
  });
}.bind(undefined);

var _this$x = undefined;

var ensureHasActiveObserver = function ensureHasActiveObserver(notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$x);
  if (notifier.activeObservers.includes(observer)) return notifier;
  throw new Error("Observer is not attached to notifier");
}.bind(undefined);
/**
 * Detaches observer from notifier
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */


var unobserve$1 = function unobserve$$1(absintheSocket, notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$x);
  return updateNotifiers(absintheSocket, refresh(unobserve(ensureHasActiveObserver(notifier, observer), observer)));
}.bind(undefined);

exports.unobserve = unobserve$1;
var _this$y = undefined;

var doUnobserveOrCancel = function doUnobserveOrCancel(absintheSocket, notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$y);
  return notifier.activeObservers.length === 1 ? cancel$1(absintheSocket, notifier) : unobserve$1(absintheSocket, notifier, observer);
}.bind(undefined);
/**
 * Cancels notifier if there are no more observers apart from the one given, or
 * detaches given observer from notifier otherwise
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */


var unobserveOrCancel = function unobserveOrCancel(absintheSocket, notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$y);
  return notifier.isActive ? doUnobserveOrCancel(absintheSocket, notifier, observer) : absintheSocket;
}.bind(undefined); //# sourceMappingURL=index.js.map


exports.unobserveOrCancel = unobserveOrCancel;
},{"core-js/modules/es6.array.find-index":"7sVm","core-js/modules/es6.array.find":"Qppk","core-js/modules/es6.function.name":"N3yi","@jumpn/utils-composite":"7Q0f","phoenix":"XFqm","core-js/modules/web.dom.iterable":"v6Aj","core-js/modules/es6.array.for-each":"VsIt","@babel/runtime/helpers/toConsumableArray":"Fhqp","@jumpn/utils-graphql":"2hqA","zen-observable":"U0NN","core-js/modules/es7.array.includes":"TLss","core-js/modules/es6.string.includes":"fH7p","@babel/runtime/helpers/objectSpread":"fwAU","@babel/runtime/helpers/objectWithoutProperties":"U8F3","core-js/modules/es6.array.index-of":"LvRh","@jumpn/utils-array":"Yu+T","core-js/modules/es6.function.bind":"WIhg","@babel/runtime/helpers/newArrowCheck":"tS9b"}],"P6qz":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AbsintheSocket = __importStar(require("@absinthe/socket"));

var Phoenix = __importStar(require("phoenix"));

var GraphQLClientSocket =
/*#__PURE__*/
function () {
  function GraphQLClientSocket(config) {
    var _this = this;

    _classCallCheck(this, GraphQLClientSocket);

    this.query = '';
    this.isCurrentlySubscribed = false;

    this.unsubscribe = function () {
      AbsintheSocket.cancel(_this.absintheSocket, _this.notifier);
      _this.notifier = null;
      _this.absintheSocket = null;
      _this.isCurrentlySubscribed = false;
    };

    this.socketUrl = config.socketUrl;
    this.authToken = config.authToken;
    this.query = config.query;

    this.onAbort = config.onAbort || function () {};

    this.onStart = config.onStart || function () {};

    this.onResult = config.onResult || function () {};

    this.initializeSocket();
    this.initializeObserver();
  }

  _createClass(GraphQLClientSocket, [{
    key: "initializeSocket",
    value: function initializeSocket() {
      this.absintheSocket = AbsintheSocket.create(new Phoenix.Socket(this.socketUrl, {
        params: {
          token: this.authToken
        }
      }));
      this.notifier = AbsintheSocket.send(this.absintheSocket, {
        operation: this.query
      });
    }
  }, {
    key: "initializeObserver",
    value: function initializeObserver() {
      var _this2 = this;

      AbsintheSocket.observe(this.absintheSocket, this.notifier, {
        onStart: function onStart() {
          if (!_this2.isCurrentlySubscribed) {
            _this2.isCurrentlySubscribed = true;

            _this2.onStart();
          }
        },
        onAbort: this.onAbort,
        onResult: this.onResult
      });
    }
  }]);

  return GraphQLClientSocket;
}();

exports.GraphQLClientSocket = GraphQLClientSocket;
},{"@absinthe/socket":"zTqj","phoenix":"XFqm"}],"Cteb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNREAD_MESSAGES_CHANGE = 'UNREAD_MESSAGES_CHANGE';
exports.UNREAD_REPLIES_CHANGE = 'UNREAD_REPLIES_CHANGE';
exports.LAST_READ_MESSAGE_CHANGE = 'LAST_READ_MESSAGE_CHANGE';
exports.UNREAD_MESSAGES_SUBSCRIBE_SUCCESS = 'UNREAD_MESSAGES_SUBSCRIBE_SUCCESS';
exports.UNREAD_MESSAGES_SUBSCRIBE_ERROR = 'UNREAD_MESSAGES_SUBSCRIBE_ERROR';
exports.UNREAD_FETCH_COUNTS_SUCCESS = 'UNREAD_FETCH_COUNTS_SUCCESS';
exports.UNREAD_FETCH_COUNTS_ERROR = 'UNREAD_FETCH_COUNTS_ERROR';
exports.JOIN_ROOM_SUCCESS = 'JOIN_ROOM_SUCCESS';
exports.JOIN_ROOM_ERROR = 'JOIN_ROOM_ERROR';
exports.OPERATOR_ONLINE_STATUS_CHANGE = 'OPERATOR_ONLINE_STATUS_CHANGE';
exports.OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS = 'OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS';
exports.OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR = 'OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR';
exports.TYPING_STATUS_CHANGE = 'TYPING_STATUS_CHANGE';
exports.TYPING_STATUS_SUBSCRIBE_SUCCESS = 'TYPING_STATUS_SUBSCRIBE_SUCCESS';
exports.TYPING_STATUS_SUBSCRIBE_ERROR = 'TYPING_STATUS_SUBSCRIBE_ERROR';
exports.MESSAGES_SUBSCRIBE_SUCCESS = 'MESSAGES_SUBSCRIBE_SUCCESS';
exports.MESSAGES_SUBSCRIBE_ERROR = 'MESSAGES_SUBSCRIBE_ERROR';
exports.MESSAGES_HISTORY_SET = 'MESSAGES_HISTORY_SET';
exports.MESSAGES_HISTORY_APPEND_ONE = 'MESSAGES_HISTORY_APPEND_ONE';
exports.MESSAGES_HISTORY_APPEND_MANY = 'MESSAGES_HISTORY_APPEND_MANY';
exports.MESSAGES_HISTORY_PREPEND_ONE = 'MESSAGES_HISTORY_PREPEND_ONE';
exports.MESSAGES_HISTORY_PREPEND_MANY = 'MESSAGES_HISTORY_PREPEND_MANY';
exports.MESSAGES_HISTORY_CHANGE_ONE = 'MESSAGES_HISTORY_CHANGE_ONE';
exports.MESSAGES_HISTORY_CHANGE_MANY = 'MESSAGES_HISTORY_CHANGE_MANY';
exports.MESSAGES_FETCH_HISTORY_SUCCESS = 'MESSAGES_FETCH_HISTORY_SUCCESS';
exports.MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS = 'MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS';
exports.MESSAGES_FETCH_HISTORY_ERROR = 'MESSAGES_FETCH_HISTORY_ERROR';
exports.MESSAGES_FETCH_HISTORY_INITIAL_ERROR = 'MESSAGES_FETCH_HISTORY_INITIAL_ERROR';
},{}],"xY1B":[function(require,module,exports) {
"use strict";

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n    query {\n      room {\n        unreadMessagesCount\n        unreadRepliesCount\n      }\n    }\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n    mutation ($messageId: ID!) {\n      updateLastReadMessage(messageId: $messageId) {\n        unreadMessagesCount,\n        unreadRepliesCount,\n      }\n    }\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    subscription {\n      updateReadMessages {\n        unreadMessagesCount\n        unreadRepliesCount\n        lastReadMessageId\n      }\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var utilsCommon_1 = require("../utilsCommon");

var GraphQLClient_1 = require("./GraphQLClient");

var GraphQLClientSocket_1 = require("./GraphQLClientSocket");

var ElixirChatEventTypes_1 = require("./ElixirChatEventTypes");

var UnreadMessagesCounter =
/*#__PURE__*/
function () {
  function UnreadMessagesCounter(_ref) {
    var _this = this;

    var elixirChat = _ref.elixirChat;

    _classCallCheck(this, UnreadMessagesCounter);

    this.unreadMessagesCount = 0;
    this.unreadRepliesCount = 0;
    this.lastReadMessageId = null;
    this.subscriptionQuery = GraphQLClient_1.gql(_templateObject());
    this.setLastReadMessageQuery = GraphQLClient_1.gql(_templateObject2());
    this.fetchUnreadCountsQuery = GraphQLClient_1.gql(_templateObject3());

    this.subscribe = function () {
      var _this$elixirChat = _this.elixirChat,
          apiUrl = _this$elixirChat.apiUrl,
          authToken = _this$elixirChat.authToken;
      _this.graphQLClient = new GraphQLClient_1.GraphQLClient({
        url: apiUrl,
        token: authToken
      });

      _this.fetchUnreadCounts();

      _this.initializeSocketClient();
    };

    this.unsubscribe = function () {
      var debug = _this.elixirChat.debug;
      utilsCommon_1.logEvent(debug, 'Unsubscribing from unread messages count...');
      _this.unreadMessagesCount = 0;
      _this.unreadRepliesCount = 0;

      _this.graphQLClientSocket.unsubscribe();

      _this.graphQLClientSocket = null;
      _this.graphQLClient = null;
    };

    this.setLastReadMessage = function (messageId) {
      return _this.graphQLClient.query(_this.setLastReadMessageQuery, {
        messageId: messageId
      });
    };

    this.fetchUnreadCounts = function () {
      var _this$elixirChat2 = _this.elixirChat,
          debug = _this$elixirChat2.debug,
          triggerEvent = _this$elixirChat2.triggerEvent;
      return _this.graphQLClient.query(_this.fetchUnreadCountsQuery, {}).then(function (response) {
        if (response && response.room) {
          utilsCommon_1.logEvent(debug, 'Fetched unread counts', response.room);
          triggerEvent(ElixirChatEventTypes_1.UNREAD_FETCH_COUNTS_SUCCESS, response);

          _this.onUnreadCountsUpdate(response.room);

          return response;
        } else {
          utilsCommon_1.logEvent(debug, 'Failed to fetch unread counts', response, 'error');
          triggerEvent(ElixirChatEventTypes_1.UNREAD_FETCH_COUNTS_ERROR, response);
          throw response;
        }
      }).catch(function (error) {
        utilsCommon_1.logEvent(debug, 'Failed to fetch unread counts', error, 'error');
        triggerEvent(ElixirChatEventTypes_1.UNREAD_FETCH_COUNTS_ERROR, error);
        throw error;
      });
    };

    this.onUnreadCountsUpdate = function (data) {
      var _this$elixirChat3 = _this.elixirChat,
          debug = _this$elixirChat3.debug,
          triggerEvent = _this$elixirChat3.triggerEvent;
      var unreadMessagesCount = data.unreadMessagesCount,
          unreadRepliesCount = data.unreadRepliesCount,
          lastReadMessageId = data.lastReadMessageId;

      if (unreadMessagesCount !== _this.unreadMessagesCount) {
        utilsCommon_1.logEvent(debug, 'Unread messages count changed to ' + unreadMessagesCount);
        _this.unreadMessagesCount = unreadMessagesCount;
        triggerEvent(ElixirChatEventTypes_1.UNREAD_MESSAGES_CHANGE, unreadMessagesCount);
      }

      if (unreadRepliesCount !== _this.unreadRepliesCount) {
        utilsCommon_1.logEvent(debug, 'Unread replies count changed to ' + unreadRepliesCount);
        _this.unreadRepliesCount = unreadRepliesCount;
        triggerEvent(ElixirChatEventTypes_1.UNREAD_REPLIES_CHANGE, unreadRepliesCount);
      }

      if (lastReadMessageId !== _this.lastReadMessageId) {
        utilsCommon_1.logEvent(debug, 'Last message marked as read changed to ID: ' + lastReadMessageId);
        _this.lastReadMessageId = lastReadMessageId;
        triggerEvent(ElixirChatEventTypes_1.LAST_READ_MESSAGE_CHANGE, lastReadMessageId);
      }
    };

    this.elixirChat = elixirChat;
  }

  _createClass(UnreadMessagesCounter, [{
    key: "initializeSocketClient",
    value: function initializeSocketClient() {
      var _this2 = this;

      var _this$elixirChat4 = this.elixirChat,
          socketUrl = _this$elixirChat4.socketUrl,
          authToken = _this$elixirChat4.authToken,
          debug = _this$elixirChat4.debug,
          triggerEvent = _this$elixirChat4.triggerEvent;
      this.graphQLClientSocket = new GraphQLClientSocket_1.GraphQLClientSocket({
        socketUrl: socketUrl,
        authToken: authToken,
        query: this.subscriptionQuery,
        onAbort: function onAbort(error) {
          utilsCommon_1.logEvent(debug, 'Failed to subscribe to unread messages count', error, 'error');
          triggerEvent(ElixirChatEventTypes_1.UNREAD_MESSAGES_SUBSCRIBE_ERROR, error);
        },
        onStart: function onStart() {
          utilsCommon_1.logEvent(debug, 'Successfully subscribed to unread messages count');
          triggerEvent(ElixirChatEventTypes_1.UNREAD_MESSAGES_SUBSCRIBE_SUCCESS);
        },
        onResult: function onResult(response) {
          var data = utilsCommon_1._get(response, 'data.updateReadMessages') || {};

          _this2.onUnreadCountsUpdate(data);
        }
      });
    }
  }]);

  return UnreadMessagesCounter;
}();

exports.UnreadMessagesCounter = UnreadMessagesCounter;
},{"../utilsCommon":"EjGt","./GraphQLClient":"1fv+","./GraphQLClientSocket":"P6qz","./ElixirChatEventTypes":"Cteb"}],"QERd":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Phoenix = __importStar(require("phoenix"));

var ElixirChatEventTypes_1 = require("./ElixirChatEventTypes");

var utilsCommon_1 = require("../utilsCommon");

var TypingStatusSubscription =
/*#__PURE__*/
function () {
  function TypingStatusSubscription(_ref) {
    var _this = this;

    var elixirChat = _ref.elixirChat;

    _classCallCheck(this, TypingStatusSubscription);

    this.hasConnectErrorOccurred = false;
    this.currentlyTypingUsers = [];
    this.typingTimeouts = {};
    this.typedText = '';

    this.subscribe = function () {
      _this.initializeSocket(function () {
        _this.joinChannel();
      });
    };

    this.unsubscribe = function () {
      var debug = _this.elixirChat.debug;
      utilsCommon_1.logEvent(debug, 'Unsubscribing from typing status change...');

      _this.channel.leave();

      _this.phoenixSocket = null;
      _this.channel = null;
      _this.currentlyTypingUsers = [];
      _this.hasConnectErrorOccurred = false;
      Object.values(_this.typingTimeouts).forEach(function (timeout) {
        return clearTimeout(timeout);
      });
      _this.typingTimeouts = [];
      _this.typedText = '';
    };

    this.dispatchTypedText = function (typedText) {
      if (_this.channel) {
        var trimmedText = typeof typedText === 'string' ? typedText.trim() : '';

        if (typedText === false) {
          _this.channel.push('typing', {
            typing: false,
            text: ''
          });
        } else if (_this.typedText !== trimmedText) {
          _this.channel.push('typing', {
            typing: Boolean(trimmedText),
            text: trimmedText
          });

          _this.typedText = trimmedText;
        }
      }
    };

    this.onPresenceDiff = function (diff) {
      var elixirChatClientId = _this.elixirChat.elixirChatClientId;
      var userId;
      var userData;
      var userMeta;

      try {
        userId = Object.keys(diff.joins)[0];
        userData = Object.values(diff.joins)[0];
        userMeta = userData.metas[0];
      } catch (e) {}

      if (!userMeta || userId === elixirChatClientId) {
        return;
      }

      var currentlyTypingUserIds = _this.currentlyTypingUsers.map(function (user) {
        return user.id;
      });

      var userFullName = userData.first_name + ' ' + userData.last_name;
      var serializedUserData = {
        id: userId,
        firstName: userData.first_name,
        lastName: userData.last_name,
        avatar: {
          url: userData.avatar
        }
      };

      if (userMeta.typing) {
        _this.removeFromCurrentlyTypingUsersAfterTimeout(userId, userFullName);
      }

      if (userMeta.typing && !currentlyTypingUserIds.includes(userId)) {
        _this.triggerOnChangeEvent([].concat(_toConsumableArray(_this.currentlyTypingUsers), [serializedUserData]));
      } else if (!userMeta.typing && currentlyTypingUserIds.includes(userId)) {
        _this.triggerOnChangeEvent(_this.currentlyTypingUsers.filter(function (user) {
          return user.id !== userId;
        }));
      }
    };

    this.elixirChat = elixirChat;
  }

  _createClass(TypingStatusSubscription, [{
    key: "initializeSocket",
    value: function initializeSocket() {
      var _this2 = this;

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var _this$elixirChat = this.elixirChat,
          triggerEvent = _this$elixirChat.triggerEvent,
          debug = _this$elixirChat.debug,
          socketUrl = _this$elixirChat.socketUrl,
          authToken = _this$elixirChat.authToken;
      this.phoenixSocket = new Phoenix.Socket(socketUrl, {
        params: {
          token: authToken
        }
      });
      this.phoenixSocket.onError(function (error) {
        if (!_this2.hasConnectErrorOccurred) {
          var message = 'Failed to subscribe to typing status change: could not open connection via Phoenix.Socket';
          _this2.hasConnectErrorOccurred = true;
          utilsCommon_1.logEvent(debug, message, error, 'error');
          triggerEvent(ElixirChatEventTypes_1.TYPING_STATUS_SUBSCRIBE_ERROR, error);
        }
      });
      this.phoenixSocket.onOpen(callback);
      this.phoenixSocket.connect();
    }
  }, {
    key: "joinChannel",
    value: function joinChannel() {
      var _this3 = this;

      var _this$elixirChat2 = this.elixirChat,
          triggerEvent = _this$elixirChat2.triggerEvent,
          debug = _this$elixirChat2.debug,
          elixirChatRoomId = _this$elixirChat2.elixirChatRoomId;
      this.channel = this.phoenixSocket.channel('public:room:' + elixirChatRoomId, {});
      this.channel.join().receive('error', function (error) {
        utilsCommon_1.logEvent(debug, 'Failed to subscribe to typing status change: channel received error', error, 'error');
        triggerEvent(ElixirChatEventTypes_1.TYPING_STATUS_SUBSCRIBE_ERROR, error);
      }).receive('timeout', function () {
        utilsCommon_1.logEvent(debug, 'Failed to subscribe to typing status change: channel received timeout', null, 'error');
        triggerEvent(ElixirChatEventTypes_1.TYPING_STATUS_SUBSCRIBE_ERROR);
      }).receive('ok', function (data) {
        _this3.channel.on('presence_diff', _this3.onPresenceDiff);

        utilsCommon_1.logEvent(debug, 'Successfully subscribed to typing status change', data);
        setTimeout(function () {
          return triggerEvent(ElixirChatEventTypes_1.TYPING_STATUS_SUBSCRIBE_SUCCESS, data);
        });
      });
    }
  }, {
    key: "removeFromCurrentlyTypingUsersAfterTimeout",
    value: function removeFromCurrentlyTypingUsersAfterTimeout(userId, userFullName) {
      var _this4 = this;

      clearTimeout(this.typingTimeouts[userId]);
      this.typingTimeouts[userId] = setTimeout(function () {
        _this4.triggerOnChangeEvent(_this4.currentlyTypingUsers.filter(function (user) {
          return user.id !== userId;
        }));
      }, 2000);
    }
  }, {
    key: "triggerOnChangeEvent",
    value: function triggerOnChangeEvent(updatedTypingUsers) {
      var _this$elixirChat3 = this.elixirChat,
          triggerEvent = _this$elixirChat3.triggerEvent,
          debug = _this$elixirChat3.debug;

      if (updatedTypingUsers.length || this.currentlyTypingUsers.length) {
        var didStopTyping = this.currentlyTypingUsers.length > updatedTypingUsers.length;
        this.currentlyTypingUsers = updatedTypingUsers;
        utilsCommon_1.logEvent(debug, "Some users ".concat(didStopTyping ? 'stopped' : 'started', " typing"), this.currentlyTypingUsers);
        triggerEvent(ElixirChatEventTypes_1.TYPING_STATUS_CHANGE, this.currentlyTypingUsers);
      }
    }
  }]);

  return TypingStatusSubscription;
}();

exports.TypingStatusSubscription = TypingStatusSubscription;
},{"phoenix":"XFqm","./ElixirChatEventTypes":"Cteb","../utilsCommon":"EjGt"}],"zgd1":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    subscription {\n      updateCompanyWorking\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ElixirChatEventTypes_1 = require("./ElixirChatEventTypes");

var GraphQLClient_1 = require("./GraphQLClient");

var GraphQLClientSocket_1 = require("./GraphQLClientSocket");

var utilsCommon_1 = require("../utilsCommon");

var OperatorOnlineStatusSubscription =
/*#__PURE__*/
function () {
  function OperatorOnlineStatusSubscription(_ref) {
    var _this = this;

    var elixirChat = _ref.elixirChat;

    _classCallCheck(this, OperatorOnlineStatusSubscription);

    this.subscriptionQuery = GraphQLClient_1.gql(_templateObject());

    this.subscribe = function (areAnyOperatorsOnline) {
      var triggerEvent = _this.elixirChat.triggerEvent;
      _this.areAnyOperatorsOnline = areAnyOperatorsOnline;
      triggerEvent(ElixirChatEventTypes_1.OPERATOR_ONLINE_STATUS_CHANGE, _this.areAnyOperatorsOnline);

      _this.initializeSocketClient();
    };

    this.unsubscribe = function () {
      var debug = _this.elixirChat.debug;
      utilsCommon_1.logEvent(debug, 'Unsubscribing from operator online status change...');

      _this.graphQLClientSocket.unsubscribe();

      _this.graphQLClientSocket = null;
    };

    this.elixirChat = elixirChat;
  }

  _createClass(OperatorOnlineStatusSubscription, [{
    key: "initializeSocketClient",
    value: function initializeSocketClient() {
      var _this2 = this;

      var _this$elixirChat = this.elixirChat,
          socketUrl = _this$elixirChat.socketUrl,
          authToken = _this$elixirChat.authToken,
          debug = _this$elixirChat.debug,
          triggerEvent = _this$elixirChat.triggerEvent;
      this.graphQLClientSocket = new GraphQLClientSocket_1.GraphQLClientSocket({
        socketUrl: socketUrl,
        authToken: authToken,
        query: this.subscriptionQuery,
        onAbort: function onAbort(error) {
          utilsCommon_1.logEvent(debug, 'Failed to subscribe to operator online status change', error, 'error');
          triggerEvent(ElixirChatEventTypes_1.OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR, error);
        },
        onStart: function onStart() {
          utilsCommon_1.logEvent(debug, 'Successfully subscribed to operator online status change');
          triggerEvent(ElixirChatEventTypes_1.OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS);
        },
        onResult: function onResult(_ref2) {
          var data = _ref2.data;
          _this2.areAnyOperatorsOnline = data && data.updateCompanyWorking;
          utilsCommon_1.logEvent(debug, _this2.areAnyOperatorsOnline ? 'Operators got back online' : 'All operators went offline');
          triggerEvent(ElixirChatEventTypes_1.OPERATOR_ONLINE_STATUS_CHANGE, _this2.areAnyOperatorsOnline);
        }
      });
    }
  }]);

  return OperatorOnlineStatusSubscription;
}();

exports.OperatorOnlineStatusSubscription = OperatorOnlineStatusSubscription;
},{"./ElixirChatEventTypes":"Cteb","./GraphQLClient":"1fv+","./GraphQLClientSocket":"P6qz","../utilsCommon":"EjGt"}],"sQAQ":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  fragment fragmentFile on File {\n    id\n    url\n    name\n    bytesSize\n    height\n    width\n    contentType\n    thumbnails {\n      id\n      url\n      name\n      bytesSize\n      height\n      width\n      contentType\n      thumbType\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GraphQLClient_1 = require("../GraphQLClient");

exports.fragmentFile = GraphQLClient_1.gql(_templateObject());

function serializeFile(fileData, elixirChat) {
  var file = fileData || {};
  var thumbnails = null;

  if (file.thumbnails && file.thumbnails.length) {
    thumbnails = file.thumbnails.map(function (thumbnail) {
      var serializedThumbnail = serializeFile(thumbnail, elixirChat);
      return {
        id: serializedThumbnail.id,
        url: serializedThumbnail.url,
        name: serializedThumbnail.name,
        bytesSize: serializedThumbnail.bytesSize,
        width: serializedThumbnail.width,
        height: serializedThumbnail.height,
        contentType: serializedThumbnail.contentType,
        thumbType: thumbnail.thumbType || null
      };
    });
  }

  var uploadsUrlPrefix = elixirChat.backendStaticUrl.replace(/\/$/, '') + '/';
  var fileUrl = '';

  if (file.url) {
    fileUrl = /^uploads/i.test(file.url) ? uploadsUrlPrefix + file.url : file.url;
  }

  return {
    id: file.id || null,
    url: fileUrl,
    name: file.name || '',
    bytesSize: file.bytesSize || 0,
    height: file.height || 0,
    width: file.width || 0,
    thumbnails: thumbnails,
    contentType: file.contentType || null,
    isScreenshot: file.isScreenshot || false
  };
}

exports.serializeFile = serializeFile;
},{"../GraphQLClient":"1fv+"}],"ZEl5":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  fragment fragmentMessage on Message {\n    id\n    tempId\n    text\n    timestamp\n    system\n    unread\n    sender {\n      ... on Client { ...fragmentClient }\n      ... on CompanyEmployee { ...fragmentCompanyEmployee }\n    }\n    attachments {\n      ...fragmentFile\n    }\n    data {\n      ... on SystemMessageData {\n        type\n        author {\n          ...fragmentCompanyEmployee\n        }\n        whenWouldWork\n      }\n      ... on NotSystemMessageData {\n        responseToMessage {\n          id\n          text\n          sender {\n            __typename\n            ... on Client { ...fragmentClient }\n            ... on CompanyEmployee { ...fragmentCompanyEmployee }\n          }\n        }\n      }\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GraphQLClient_1 = require("../GraphQLClient");

var utilsCommon_1 = require("../../utilsCommon");

var serializeUser_1 = require("./serializeUser");

var serializeFile_1 = require("./serializeFile");

exports.fragmentMessage = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject()), {
  fragmentClient: serializeUser_1.fragmentClient,
  fragmentCompanyEmployee: serializeUser_1.fragmentCompanyEmployee,
  fragmentFile: serializeFile_1.fragmentFile
});

function serializeMessage(message, elixirChat) {
  var _message$sender = message.sender,
      sender = _message$sender === void 0 ? {} : _message$sender,
      attachments = message.attachments,
      _message$data = message.data,
      data = _message$data === void 0 ? {} : _message$data;
  var responseToMessage = data.responseToMessage,
      _data$author = data.author,
      author = _data$author === void 0 ? {} : _data$author;
  var serializedSender = serializeUser_1.serializeUser(Object.assign({}, sender, author), elixirChat);
  var serializedAttachments = (attachments || []).map(function (attachment) {
    return serializeFile_1.serializeFile(attachment, elixirChat);
  });

  var responseToMessageSender = utilsCommon_1._get(responseToMessage, 'sender', {});

  var serializedResponseToMessage = {
    id: utilsCommon_1._get(responseToMessage, 'id') || null,
    text: utilsCommon_1._get(responseToMessage, 'text') || '',
    sender: serializeUser_1.serializeUser(responseToMessageSender, elixirChat)
  };

  var isSystem = utilsCommon_1._get(message, 'system', false);

  return {
    id: utilsCommon_1._get(message, 'id') || null,
    tempId: utilsCommon_1._get(message, 'tempId') || null,
    text: utilsCommon_1._get(message, 'text') || '',
    timestamp: utilsCommon_1._get(message, 'timestamp') || '',
    cursor: utilsCommon_1._get(message, 'cursor') || null,
    sender: serializedSender,
    responseToMessage: serializedResponseToMessage.id ? serializedResponseToMessage : null,
    attachments: serializedAttachments,
    isSubmitting: utilsCommon_1._get(message, 'isSubmitting') || false,
    isSubmissionError: utilsCommon_1._get(message, 'isSubmissionError') || false,
    isUnread: utilsCommon_1._get(message, 'unread') || false,
    isSystem: isSystem,
    systemData: !isSystem ? null : {
      type: utilsCommon_1._get(message, 'data.type') || null,
      whenWouldWork: utilsCommon_1._get(message, 'data.whenWouldWork') || null
    }
  };
}

exports.serializeMessage = serializeMessage;
},{"../GraphQLClient":"1fv+","../../utilsCommon":"EjGt","./serializeUser":"1lqy","./serializeFile":"sQAQ"}],"jRw6":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n    query ($beforeCursor: String, $limit: Int!) {\n      messages(before: $beforeCursor, last: $limit) {\n        edges {\n          cursor\n          node {\n            ...fragmentMessage\n          }\n        }\n      }\n    }\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n    mutation ($text: String!, $responseToMessageId: ID, $attachments: [Upload!], $tempId: ID) {\n      sendMessage(text: $text, responseToMessageId: $responseToMessageId, attachments: $attachments, tempId: $tempId) {\n        ...fragmentMessage\n      }\n    }\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    subscription {\n      newMessage {\n        ...fragmentMessage\n      }\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ElixirChatEventTypes_1 = require("./ElixirChatEventTypes");

var serializeMessage_1 = require("./serializers/serializeMessage");

var utilsCommon_1 = require("../utilsCommon");

var GraphQLClientSocket_1 = require("./GraphQLClientSocket");

var GraphQLClient_1 = require("./GraphQLClient");

var MessageSubscription =
/*#__PURE__*/
function () {
  function MessageSubscription(_ref) {
    var _this = this;

    var elixirChat = _ref.elixirChat;

    _classCallCheck(this, MessageSubscription);

    this.messageHistory = [];
    this.hasMessageHistoryBeenEverFetched = false;
    this.temporaryMessageTempIds = [];
    this.latestMessageHistoryCursorsCache = [];
    this.reachedBeginningOfMessageHistory = false;
    this.subscriptionQuery = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject()), {
      fragmentMessage: serializeMessage_1.fragmentMessage
    });
    this.sendMessageQuery = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject2()), {
      fragmentMessage: serializeMessage_1.fragmentMessage
    });
    this.messageHistoryQuery = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject3()), {
      fragmentMessage: serializeMessage_1.fragmentMessage
    });

    this.subscribe = function () {
      var _this$elixirChat = _this.elixirChat,
          apiUrl = _this$elixirChat.apiUrl,
          authToken = _this$elixirChat.authToken;
      _this.graphQLClient = new GraphQLClient_1.GraphQLClient({
        url: apiUrl,
        token: authToken
      });

      _this.initializeSocketClient();
    };

    this.onMessageReceive = function (response) {
      var _this$elixirChat2 = _this.elixirChat,
          backendStaticUrl = _this$elixirChat2.backendStaticUrl,
          client = _this$elixirChat2.client,
          triggerEvent = _this$elixirChat2.triggerEvent,
          debug = _this$elixirChat2.debug;

      var data = utilsCommon_1._get(response, 'data.newMessage');

      if (!data) {
        return;
      }

      var message = serializeMessage_1.serializeMessage(data, {
        backendStaticUrl: backendStaticUrl,
        client: client
      });

      if (_this.temporaryMessageTempIds.includes(message.tempId)) {
        _this.enrichTemporaryMessage(message.tempId, message, true);

        utilsCommon_1.logEvent(debug, 'Enriched temporary message with actual one', {
          message: message
        });
        triggerEvent(ElixirChatEventTypes_1.MESSAGES_HISTORY_CHANGE_ONE, message, _this.messageHistory);
      } else {
        _this.messageHistory.push(message);

        utilsCommon_1.logEvent(debug, 'Received new message', {
          message: message
        });
        triggerEvent(ElixirChatEventTypes_1.MESSAGES_HISTORY_APPEND_ONE, message, _this.messageHistory);
      }
    };

    this.sendMessage = function (params) {
      var _this$elixirChat3 = _this.elixirChat,
          backendStaticUrl = _this$elixirChat3.backendStaticUrl,
          client = _this$elixirChat3.client,
          debug = _this$elixirChat3.debug;

      var _this$serializeSendMe = _this.serializeSendMessageParams(params),
          variables = _this$serializeSendMe.variables,
          binaries = _this$serializeSendMe.binaries;

      var tempId;

      if (!variables.text && !variables.attachments.length) {
        var errorMessage = 'Either "text" or "attachments" parameter must not be empty';
        utilsCommon_1.logEvent(debug, errorMessage, {
          variables: variables
        }, 'error');
        return new Promise(function (resolve, reject) {
          reject({
            message: errorMessage
          });
        });
      }

      if (params.appendConditionally) {
        tempId = utilsCommon_1.randomDigitStringId(6);
        variables.tempId = tempId;

        var temporaryMessage = _this.generateTemporaryMessage(tempId, params);

        _this.appendMessageConditionally(temporaryMessage);
      } else if (params.retrySubmissionByTempId) {
        tempId = params.retrySubmissionByTempId;
        variables.tempId = tempId;

        _this.enrichTemporaryMessage(tempId, {
          isSubmitting: true,
          isSubmissionError: false
        });
      }

      return new Promise(function (resolve, reject) {
        _this.graphQLClient.query(_this.sendMessageQuery, variables, binaries).then(function (response) {
          if (response && response.sendMessage) {
            var message = serializeMessage_1.serializeMessage(response.sendMessage, {
              backendStaticUrl: backendStaticUrl,
              client: client
            });
            utilsCommon_1.logEvent(_this.debug, 'Sent message', {
              params: params,
              variables: variables,
              message: message
            });
            resolve(message);
          } else {
            _this.onSendMessageFailure(tempId, response);

            reject(response);
          }
        }).catch(function (error) {
          _this.onSendMessageFailure(tempId, error);

          reject(error);
        });
      });
    };

    this.retrySendMessage = function (message) {
      _this.sendMessage({
        text: message.text,
        attachments: message.attachments,
        responseToMessageId: utilsCommon_1._get(message, 'responseToMessage.id'),
        retrySubmissionByTempId: message.tempId
      });
    };

    this.getMessageHistoryByCursor = function (limit, beforeCursor) {
      var _this$elixirChat4 = _this.elixirChat,
          triggerEvent = _this$elixirChat4.triggerEvent,
          backendStaticUrl = _this$elixirChat4.backendStaticUrl,
          client = _this$elixirChat4.client;
      return new Promise(function (resolve, reject) {
        if (_this.reachedBeginningOfMessageHistory) {
          resolve([]);
          return;
        }

        _this.graphQLClient.query(_this.messageHistoryQuery, {
          limit: limit,
          beforeCursor: beforeCursor
        }).then(function (response) {
          if (response.messages) {
            var hasMessageHistoryBeenEverFetched = _this.hasMessageHistoryBeenEverFetched;
            var processedMessages = GraphQLClient_1.simplifyGraphQLJSON(response.messages).map(function (message) {
              return serializeMessage_1.serializeMessage(message, {
                backendStaticUrl: backendStaticUrl,
                client: client
              });
            }).filter(function (message) {
              // Preventing message duplication if overlapping ranges of messages were fetched
              return !_this.latestMessageHistoryCursorsCache.includes(message.cursor);
            });
            _this.hasMessageHistoryBeenEverFetched = true;
            _this.latestMessageHistoryCursorsCache = [].concat(_toConsumableArray(processedMessages.map(function (message) {
              return message.cursor;
            })), _toConsumableArray(_this.latestMessageHistoryCursorsCache)).slice(0, limit);
            _this.reachedBeginningOfMessageHistory = processedMessages.length < limit;

            if (_this.reachedBeginningOfMessageHistory) {
              processedMessages.unshift(_this.generateNewClientPlaceholderMessage(processedMessages));
            }

            triggerEvent(hasMessageHistoryBeenEverFetched ? ElixirChatEventTypes_1.MESSAGES_FETCH_HISTORY_SUCCESS : ElixirChatEventTypes_1.MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS, processedMessages, _this.messageHistory);
            resolve(processedMessages);
          } else {
            _this.onGetMessageHistoryByCursorFailure(response);

            reject(response);
          }
        }).catch(function (error) {
          _this.onGetMessageHistoryByCursorFailure(error);

          reject(error);
        });
      });
    };

    this.fetchMessageHistory = function (limit) {
      var _this$elixirChat5 = _this.elixirChat,
          triggerEvent = _this$elixirChat5.triggerEvent,
          debug = _this$elixirChat5.debug;
      return _this.getMessageHistoryByCursor(limit, null).then(function (processedMessageHistory) {
        _this.messageHistory = processedMessageHistory;
        utilsCommon_1.logEvent(debug, 'Fetched new message history', {
          processedMessageHistory: processedMessageHistory
        });
        triggerEvent(ElixirChatEventTypes_1.MESSAGES_HISTORY_SET, processedMessageHistory);
        return processedMessageHistory;
      });
    };

    this.fetchPrecedingMessageHistory = function (limit) {
      var _this$elixirChat6 = _this.elixirChat,
          triggerEvent = _this$elixirChat6.triggerEvent,
          debug = _this$elixirChat6.debug;
      var latestCursor = _this.messageHistory[0].cursor;

      if (!latestCursor) {
        return new Promise(function (resolve, reject) {
          var errorMessage = 'Failed to fetch previous message history - cursors not found';
          utilsCommon_1.logEvent(debug, errorMessage);
          reject({
            message: errorMessage
          });
        });
      }

      return _this.getMessageHistoryByCursor(limit, latestCursor).then(function (processedMessageHistory) {
        _this.messageHistory = processedMessageHistory.concat(_this.messageHistory);
        utilsCommon_1.logEvent(debug, 'Fetched and prepended additional message history', {
          processedMessageHistory: processedMessageHistory
        });
        triggerEvent(ElixirChatEventTypes_1.MESSAGES_HISTORY_PREPEND_MANY, processedMessageHistory, _this.messageHistory);
        return processedMessageHistory;
      });
    };

    this.unsubscribe = function () {
      var debug = _this.elixirChat.debug;
      utilsCommon_1.logEvent(debug, 'Unsubscribing from messages...');

      _this.graphQLClientSocket.unsubscribe();

      _this.graphQLClientSocket = null;
      _this.graphQLClient = null;
    };

    this.elixirChat = elixirChat;
  }

  _createClass(MessageSubscription, [{
    key: "initializeSocketClient",
    value: function initializeSocketClient() {
      var _this$elixirChat7 = this.elixirChat,
          socketUrl = _this$elixirChat7.socketUrl,
          authToken = _this$elixirChat7.authToken,
          debug = _this$elixirChat7.debug,
          triggerEvent = _this$elixirChat7.triggerEvent;
      this.graphQLClientSocket = new GraphQLClientSocket_1.GraphQLClientSocket({
        socketUrl: socketUrl,
        authToken: authToken,
        query: this.subscriptionQuery,
        onAbort: function onAbort(error) {
          utilsCommon_1.logEvent(debug, 'Failed to subscribe to messages', error, 'error');
          triggerEvent(ElixirChatEventTypes_1.MESSAGES_SUBSCRIBE_ERROR, error);
        },
        onStart: function onStart() {
          utilsCommon_1.logEvent(debug, 'Successfully subscribed to messages');
          triggerEvent(ElixirChatEventTypes_1.MESSAGES_SUBSCRIBE_SUCCESS);
        },
        onResult: this.onMessageReceive
      });
    }
  }, {
    key: "serializeSendMessageParams",
    value: function serializeSendMessageParams(params) {
      var text = typeof params.text === 'string' ? params.text.trim() : '';
      var tempId = params.tempId;
      var responseToMessageId = typeof params.responseToMessageId === 'string' ? params.responseToMessageId : null;
      var attachments = [];
      var binaries = {};

      try {
        params.attachments.forEach(function (_ref2) {
          var file = _ref2.file;
          attachments.push(file.name);
          binaries[file.name] = file;
        });
      } catch (e) {}

      return {
        variables: {
          text: text,
          tempId: tempId,
          attachments: attachments,
          responseToMessageId: responseToMessageId
        },
        binaries: binaries
      };
    }
  }, {
    key: "generateNewClientPlaceholderMessage",
    value: function generateNewClientPlaceholderMessage(messageHistory) {
      var firstMessageTimestamp = utilsCommon_1._get(messageHistory, '[0].timestamp');

      var timestamp = firstMessageTimestamp || new Date().toISOString();
      return {
        timestamp: timestamp,
        id: utilsCommon_1.randomDigitStringId(6),
        isSystem: true,
        sender: {},
        attachments: [],
        systemData: {
          type: 'NEW_CLIENT_PLACEHOLDER'
        }
      };
    }
  }, {
    key: "generateTemporaryMessage",
    value: function generateTemporaryMessage(tempId, params) {
      var text = params.text,
          attachments = params.attachments,
          responseToMessageId = params.responseToMessageId;
      var serializedResponseToMessage = this.messageHistory.filter(function (message) {
        return message.id === responseToMessageId;
      })[0];
      var serializedAttachments = attachments.map(function (attachment) {
        var file = attachment.file;
        var contentType = file.type;
        var url = URL.createObjectURL(file);
        var thumbnails = [];

        if (utilsCommon_1.isWebImage(contentType) && attachment.width && attachment.height) {
          thumbnails = [{
            id: attachment.id,
            url: url
          }];
        }

        return Object.assign({}, attachment, {
          url: url,
          thumbnails: thumbnails,
          contentType: contentType,
          bytesSize: file.size
        });
      });
      return {
        tempId: tempId,
        id: utilsCommon_1.randomDigitStringId(6),
        text: text.trim() || '',
        timestamp: new Date().toISOString(),
        sender: {
          isOperator: false,
          isCurrentClient: true
        },
        responseToMessage: serializedResponseToMessage || null,
        attachments: serializedAttachments,
        isSubmitting: true
      };
    }
  }, {
    key: "appendMessageConditionally",
    value: function appendMessageConditionally(message) {
      var _this$elixirChat8 = this.elixirChat,
          triggerEvent = _this$elixirChat8.triggerEvent,
          debug = _this$elixirChat8.debug;
      this.messageHistory.push(message);
      this.temporaryMessageTempIds.push(message.tempId);
      utilsCommon_1.logEvent(debug, 'Conditionally appended message', {
        message: message
      });
      triggerEvent(ElixirChatEventTypes_1.MESSAGES_HISTORY_APPEND_ONE, message);
    }
  }, {
    key: "enrichTemporaryMessage",
    value: function enrichTemporaryMessage(temporaryMessageTempId, messageData) {
      var _this2 = this;

      var forgetThisTemporaryMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var triggerEvent = this.elixirChat.triggerEvent;

      if (this.temporaryMessageTempIds.includes(temporaryMessageTempId)) {
        this.messageHistory.forEach(function (message) {
          if (message.tempId === temporaryMessageTempId) {
            for (var key in messageData) {
              message[key] = messageData[key];
            }

            if (forgetThisTemporaryMessage) {
              _this2.temporaryMessageTempIds = _this2.temporaryMessageTempIds.filter(function (id) {
                return id !== temporaryMessageTempId;
              });
            }

            triggerEvent(ElixirChatEventTypes_1.MESSAGES_HISTORY_CHANGE_ONE, message, _this2.messageHistory);
            return;
          }
        });
      }
    }
  }, {
    key: "onSendMessageFailure",
    value: function onSendMessageFailure(tempId, error) {
      var _this$elixirChat9 = this.elixirChat,
          triggerEvent = _this$elixirChat9.triggerEvent,
          debug = _this$elixirChat9.debug;
      utilsCommon_1.logEvent(debug, 'Failed to send message', {
        error: error,
        tempId: tempId
      }, 'error');

      if (tempId) {
        this.enrichTemporaryMessage(tempId, {
          isSubmitting: false,
          isSubmissionError: true
        });
      }
    }
  }, {
    key: "onGetMessageHistoryByCursorFailure",
    value: function onGetMessageHistoryByCursorFailure(error) {
      var _this$elixirChat10 = this.elixirChat,
          triggerEvent = _this$elixirChat10.triggerEvent,
          debug = _this$elixirChat10.debug;

      if (this.hasMessageHistoryBeenEverFetched) {
        utilsCommon_1.logEvent(debug, 'Failed to fetch message history', {
          error: error
        }, 'error');
        triggerEvent(ElixirChatEventTypes_1.MESSAGES_FETCH_HISTORY_ERROR, error);
      } else {
        utilsCommon_1.logEvent(debug, 'Failed to fetch initial message history', {
          error: error
        }, 'error');
        triggerEvent(ElixirChatEventTypes_1.MESSAGES_FETCH_HISTORY_INITIAL_ERROR, error);
      }
    }
  }]);

  return MessageSubscription;
}();

exports.MessageSubscription = MessageSubscription;
},{"./ElixirChatEventTypes":"Cteb","./serializers/serializeMessage":"ZEl5","../utilsCommon":"EjGt","./GraphQLClientSocket":"P6qz","./GraphQLClient":"1fv+"}],"Pqo8":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    mutation($companyId: Uuid!, $room: ForeignRoom, $client: ForeignClient) {\n      joinRoom (companyId: $companyId, room: $room, client: $client) {\n        token\n        company {\n          working\n          widgetTitle\n        }\n        client {\n          ...fragmentClient\n        }\n        room {\n          id\n          title\n          foreignId\n        }\n      }\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var unique_names_generator_1 = require("unique-names-generator");

var utilsCommon_1 = require("../utilsCommon");

var serializeUser_1 = require("./serializers/serializeUser");

var ScreenshotTaker_1 = require("./ScreenshotTaker");

var UnreadMessagesCounter_1 = require("./UnreadMessagesCounter");

var TypingStatusSubscription_1 = require("./TypingStatusSubscription");

var OperatorOnlineStatusSubscription_1 = require("./OperatorOnlineStatusSubscription");

var MessageSubscription_1 = require("./MessageSubscription");

var GraphQLClient_1 = require("./GraphQLClient");

var ElixirChatEventTypes_1 = require("./ElixirChatEventTypes");

var ElixirChat =
/*#__PURE__*/
function () {
  function ElixirChat(config) {
    var _this = this;

    _classCallCheck(this, ElixirChat);

    this.widgetTitle = '';
    this.defaultWidgetTitle = 'Служба поддержки';
    this.eventCallbacks = {};
    this.joinRoomQuery = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject()), {
      fragmentClient: serializeUser_1.fragmentClient
    });

    this.markPrecedingMessagesRead = function (lastReadMessageId) {
      var messageIds = _this.messageHistory.map(function (message) {
        return message.id;
      });

      var lastReadMessageIndex = messageIds.indexOf(lastReadMessageId);

      _this.messageHistory.forEach(function (message, index) {
        if (lastReadMessageIndex >= index) {
          message.isUnread = false;
        }
      });

      _this.triggerEvent(ElixirChatEventTypes_1.MESSAGES_HISTORY_CHANGE_MANY, _this.messageHistory);
    };

    this.triggerEvent = function (eventName) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      utilsCommon_1.logEvent(_this.debug, eventName, {
        params: params
      }, 'event');
      var callbacks = _this.eventCallbacks[eventName];

      if (callbacks && callbacks.length) {
        callbacks.forEach(function (callback) {
          return callback.apply(void 0, params);
        });
      }
    };

    this.on = function (eventName, callback) {
      if (eventName instanceof Array) {
        eventName.map(function (singleEventName) {
          return _this.on(singleEventName, callback);
        });
      } else {
        if (!_this.eventCallbacks[eventName]) {
          _this.eventCallbacks[eventName] = [];
        }

        _this.eventCallbacks[eventName].push(callback);
      }
    };

    this.off = function (eventName, callback) {
      var callbacks = _this.eventCallbacks[eventName];

      if (callbacks && callbacks.length) {
        _this.eventCallbacks[eventName] = callbacks.filter(function (currentCallback) {
          return currentCallback !== callback;
        });
      }
    };

    this.sendMessage = function (params) {
      if (!_this.isConnected) {
        return _this.showDisconnectedError(true);
      }

      _this.typingStatusSubscription.dispatchTypedText(false);

      return _this.messageSubscription.sendMessage(params);
    };

    this.retrySendMessage = function (message) {
      if (!_this.isConnected) {
        return _this.showDisconnectedError(true);
      }

      return _this.messageSubscription.retrySendMessage(message);
    };

    this.fetchMessageHistory = function (limit) {
      if (!_this.isConnected) {
        return _this.showDisconnectedError(true);
      }

      return _this.messageSubscription.fetchMessageHistory(limit);
    };

    this.fetchPrecedingMessageHistory = function (limit) {
      if (!_this.isConnected) {
        return _this.showDisconnectedError(true);
      }

      return _this.messageSubscription.fetchPrecedingMessageHistory(limit);
    };

    this.dispatchTypedText = function (typedText) {
      if (!_this.isConnected) {
        return _this.showDisconnectedError();
      }

      _this.typingStatusSubscription.dispatchTypedText(typedText);
    };

    this.setLastReadMessage = function (messageId) {
      if (!_this.isConnected) {
        return _this.showDisconnectedError(true);
      }

      return _this.unreadMessagesCounter.setLastReadMessage(messageId);
    };

    this.takeScreenshot = function () {
      return _this.screenshotTaker.takeScreenshot();
    };

    this.disconnect = function () {
      if (!_this.isConnected) {
        return _this.showDisconnectedError();
      }

      utilsCommon_1.logEvent(_this.debug, 'Disconnecting from ElixirChat');
      _this.isConnected = false;

      _this.messageSubscription.unsubscribe();

      _this.unreadMessagesCounter.unsubscribe();

      _this.typingStatusSubscription.unsubscribe();

      _this.operatorOnlineStatusSubscription.unsubscribe();
    };

    this.reconnect = function (_ref) {
      var room = _ref.room,
          client = _ref.client;
      utilsCommon_1.logEvent(_this.debug, 'Attempting to reconnect to another room', {
        room: room,
        client: client
      });

      _this.setRoomAndClient({
        room: room,
        client: client
      });

      _this.disconnect();

      return _this.joinRoom();
    };

    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.backendStaticUrl = config.backendStaticUrl;
    this.companyId = config.companyId;
    this.debug = config.debug || false;

    if (this.hasAllRequiredConfigParameters()) {
      this.initialize(config);
    }
  }

  _createClass(ElixirChat, [{
    key: "hasAllRequiredConfigParameters",
    value: function hasAllRequiredConfigParameters() {
      var _this2 = this;

      var requiredParams = ['apiUrl', 'socketUrl', 'backendStaticUrl', 'companyId'];
      var missingRequiredParams = requiredParams.filter(function (paramKey) {
        return !_this2[paramKey];
      });

      if (missingRequiredParams.length) {
        var message = "Required parameters: ".concat(missingRequiredParams.join(', '), " not provided. \nSee more: https://github.com/elixirchat/elixirchat-js-sdk#config");
        utilsCommon_1.logEvent(this.debug, message, null, 'error');
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "initialize",
    value: function initialize(config) {
      var _this3 = this;

      utilsCommon_1.logEvent(this.debug, 'Initializing ElixirChat', {
        apiUrl: this.apiUrl,
        socketUrl: this.socketUrl,
        backendStaticUrl: this.backendStaticUrl,
        companyId: this.companyId,
        room: this.room,
        client: this.client,
        debug: this.debug
      });
      this.on(ElixirChatEventTypes_1.JOIN_ROOM_SUCCESS, function (data) {
        utilsCommon_1.logEvent(_this3.debug, 'Joined room', data);

        var areAnyOperatorsOnline = utilsCommon_1._get(data, 'company.working');

        _this3.messageSubscription.subscribe();

        _this3.unreadMessagesCounter.subscribe();

        _this3.typingStatusSubscription.subscribe();

        _this3.operatorOnlineStatusSubscription.subscribe(areAnyOperatorsOnline);
      });
      this.on(ElixirChatEventTypes_1.JOIN_ROOM_ERROR, function (error) {
        utilsCommon_1.logEvent(_this3.debug, 'Failed to join room', {
          error: error
        }, 'error');
      });
      this.on(ElixirChatEventTypes_1.LAST_READ_MESSAGE_CHANGE, this.markPrecedingMessagesRead);
      this.setRoomAndClient({
        room: config.room,
        client: config.client
      });
      this.screenshotTaker = new ScreenshotTaker_1.ScreenshotTaker({
        elixirChat: this
      });
      this.messageSubscription = new MessageSubscription_1.MessageSubscription({
        elixirChat: this
      });
      this.unreadMessagesCounter = new UnreadMessagesCounter_1.UnreadMessagesCounter({
        elixirChat: this
      });
      this.typingStatusSubscription = new TypingStatusSubscription_1.TypingStatusSubscription({
        elixirChat: this
      });
      this.operatorOnlineStatusSubscription = new OperatorOnlineStatusSubscription_1.OperatorOnlineStatusSubscription({
        elixirChat: this
      });
      this.joinRoom();
    }
  }, {
    key: "setRoomAndClient",
    value: function setRoomAndClient(data) {
      var room = data.room || {};
      var client = data.client || {};
      var localStorageRoom = utilsCommon_1.getJSONFromLocalStorage('elixirchat-room');
      var localStorageClient = utilsCommon_1.getJSONFromLocalStorage('elixirchat-client');
      var anonymousClientData = this.generateAnonymousClientData();
      var clientId = client.id || localStorageClient.id || anonymousClientData.id;
      var clientFirstName = client.firstName || localStorageClient.firstName || anonymousClientData.firstName;
      var clientLastName = client.lastName || localStorageClient.lastName || anonymousClientData.lastName;
      this.client = {
        id: clientId,
        firstName: clientFirstName,
        lastName: clientLastName
      };
      this.isPrivate = !(room.id || localStorageRoom.id);
      var roomId = room.id || localStorageRoom.id || clientId;
      var roomTitle = room.title || localStorageRoom.title || clientFirstName + ' ' + clientLastName;
      var roomData = room.data || {};
      this.room = {
        id: roomId,
        title: roomTitle,
        data: roomData
      };
      localStorage.setItem('elixirchat-room', JSON.stringify(room));
      localStorage.setItem('elixirchat-client', JSON.stringify(client));
      utilsCommon_1.logEvent(this.debug, 'Set room and client values', {
        room: this.room,
        client: this.client,
        isPrivate: this.isPrivate
      });
    }
  }, {
    key: "generateAnonymousClientData",
    value: function generateAnonymousClientData() {
      var baseTitle = unique_names_generator_1.uniqueNamesGenerator({
        length: 2,
        separator: ' ',
        dictionaries: null
      });

      var _baseTitle$split$map = baseTitle.split(' ').map(utilsCommon_1.capitalize),
          _baseTitle$split$map2 = _slicedToArray(_baseTitle$split$map, 2),
          firstName = _baseTitle$split$map2[0],
          lastName = _baseTitle$split$map2[1];

      var randomFourDigitPostfix = utilsCommon_1.randomDigitStringId(4);
      var uniqueId = baseTitle.replace(' ', '-') + '-' + randomFourDigitPostfix;
      return {
        id: uniqueId,
        firstName: firstName,
        lastName: lastName
      };
    }
  }, {
    key: "serializeRoomData",
    value: function serializeRoomData(data) {
      var serializedData = {};

      for (var key in data) {
        serializedData[key] = data[key].toString();
      }

      return JSON.stringify(serializedData);
    }
  }, {
    key: "joinRoom",
    value: function joinRoom() {
      var _this4 = this;

      this.graphQLClient = new GraphQLClient_1.GraphQLClient({
        url: this.apiUrl
      });
      var query = this.joinRoomQuery;
      var variables = {
        companyId: this.companyId,
        client: this.client,
        room: {
          id: this.room.id,
          title: this.room.title,
          data: this.serializeRoomData(this.room.data)
        }
      };
      return this.graphQLClient.query(query, variables).then(function (_ref2) {
        var joinRoom = _ref2.joinRoom;

        if (joinRoom) {
          _this4.isConnected = true;
          _this4.authToken = joinRoom.token;
          _this4.widgetTitle = joinRoom.company.widgetTitle || _this4.defaultWidgetTitle;
          _this4.elixirChatClientId = joinRoom.client.id;
          _this4.elixirChatRoomId = joinRoom.room.id;

          _this4.triggerEvent(ElixirChatEventTypes_1.JOIN_ROOM_SUCCESS, joinRoom);
        } else {
          _this4.triggerEvent(ElixirChatEventTypes_1.JOIN_ROOM_ERROR, joinRoom);
        }
      }).catch(function (response) {
        _this4.triggerEvent(ElixirChatEventTypes_1.JOIN_ROOM_ERROR, response);
      });
    }
  }, {
    key: "showDisconnectedError",
    value: function showDisconnectedError(returnPromise) {
      var message = 'ElixirChat is not currently connected. Use reconnect() method to connect to another room.';
      utilsCommon_1.logEvent(this.debug, message, null, 'error');

      if (returnPromise) {
        return new Promise(function (resolve, reject) {
          reject({
            message: message
          });
        });
      }
    }
  }, {
    key: "areAnyOperatorsOnline",
    get: function get() {
      return this.operatorOnlineStatusSubscription.areAnyOperatorsOnline;
    }
  }, {
    key: "unreadMessagesCount",
    get: function get() {
      return this.unreadMessagesCounter.unreadMessagesCount;
    }
  }, {
    key: "unreadRepliesCount",
    get: function get() {
      return this.unreadMessagesCounter.unreadRepliesCount;
    }
  }, {
    key: "messageHistory",
    get: function get() {
      return this.messageSubscription.messageHistory;
    }
  }, {
    key: "hasMessageHistoryBeenEverFetched",
    get: function get() {
      return this.messageSubscription.hasMessageHistoryBeenEverFetched;
    }
  }, {
    key: "reachedBeginningOfMessageHistory",
    get: function get() {
      return this.messageSubscription.reachedBeginningOfMessageHistory;
    }
  }]);

  return ElixirChat;
}();

exports.ElixirChat = ElixirChat;

if (typeof window !== 'undefined') {
  window.ElixirChat = ElixirChat;
}
},{"unique-names-generator":"Qz33","../utilsCommon":"EjGt","./serializers/serializeUser":"1lqy","./ScreenshotTaker":"CLsL","./UnreadMessagesCounter":"xY1B","./TypingStatusSubscription":"QERd","./OperatorOnlineStatusSubscription":"zgd1","./MessageSubscription":"jRw6","./GraphQLClient":"1fv+","./ElixirChatEventTypes":"Cteb"}],"7QCb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ElixirChat_1 = require("./ElixirChat");

exports.default = ElixirChat_1.ElixirChat;
},{"./ElixirChat":"Pqo8"}]},{},["7QCb"], null)