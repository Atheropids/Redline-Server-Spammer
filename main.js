/*
 * Copyright (c) 2021 Atheropids, all rights reserved.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

const readline = require('readline');
const http = require('http');
const util = require('util');

/*
 * Settings are here c:
 * Modify them on your purpose.
 */

// Target C&C server domain/IP:port
let malware_host = '91.121.146.23:9519';

// Parallel connection count
let spam_members_parallel = 32;

// Number of TCP errors skipped before halting a connection loop
let error_thres = 8;

// Total limit of messagess for a single spam session
let spam_messages_limit = 1000000;

// Some cringy name sent along with random insulting messages
// Make it as cringy as possible!
let cringy_name = 'Atheropids-Hacks';

// Debug mode, spawns only one connection and gives verbose outputs
let debug_mode = false;

// Random insulting lines
// Edit them on your preference
// Make them as offensive as possible!
let insults = [
  `Fucking Scammers`,
  `Stupid Motherfucker`,
  `Go Kill Yourself`,
  `Go Kill Yourself to Save Oxygen on Earth`,
  `Hang Yourself You Idiot`,
  `Hang Yourself and Save Oxygen on Earth`,
  `Your Existence is a Waste of Resources`,
  `You Deserve Getting Hanged and Tossed into Landfill`,
  `Die in Pain You Fool`,
  `You Poor Braindead`,
  `Go Jump Off a Bridge`,
  `You Deserve Getting Murdered`,
  `Imma Rape Your Daughter`,
  `Hot Cum in Your Ass`,
  `I Cummed Inside Your Daughter and it was Great`,
  `Cum With HIV in Your Ass`,
  `${cringy_name} Owns You`,
  `Get Fucked by My Big Dick`,
  `Big Dick in Your Ass`,
  `Suck My Cock`,
  `Taste My Jizz`,
  `I Cummed Inside Your Ass`,
  `Bow Down to ${cringy_name} Pwnage`,
  `${cringy_name} Owns You and All`,
  `${cringy_name} on Top`,
  `${cringy_name} Owns Your Daughter`,
  `Your Girlfriend Cheated on You with ${cringy_name}`,
  `${cringy_name} Cummed Inside Your Babe`,
  `${cringy_name} Will Never Stop Pwning Scammers`,
  `${cringy_name} Big Dick Penetrated Your Girl`,
  `Taste the Hot Jizz From ${cringy_name}`,
  `${cringy_name} Fucked Your Girl`,
  `${cringy_name} Fucked Your Mom`,
  `${cringy_name} Fucked Your Sister`,
  `${cringy_name} Fucked You in the Ass`,
  `${cringy_name} Just Gave You AIDS`,
  `${cringy_name} Just Gave You Cancer`,
  `${cringy_name} Anti-Scam Owns You`,
  `${cringy_name} Anti-Scam Owns You and All`,
  `Bow Down to Me and My Endless Power`,
  `Bow Down to the Mighty ${cringy_name}`,
  `You Can Only Obey ${cringy_name}`,
  `${cringy_name} Never Forgive Scammers`,
  `${cringy_name} Just Stabbed Your Mom`,
  `Praise ${cringy_name}`,
  `I Have the Power of ${cringy_name} But Not You`,
  `I Pity You For Being on the Wrong Side of ${cringy_name}`,
  `You Can Only Obey ${cringy_name}`,
  `${cringy_name} Has the Power`,
  `${cringy_name} Cannot Handle Your Stench`,
  `Eww You Ugly as Fuck`,
  `Go Fuck Yourself`,
  `Stop Wasting Resources on Earth and Go Hang Yourself`,
  `${cringy_name} Recommend You to Commit Suicide`,
  `Help Relieving Global Warming by Hanging Yourself`,
  `Your Worthless Life Deserves a Painful Death`,
  `Unlike ${cringy_name} Your Life is Worthless`,
  `${cringy_name} Just Fed You My Shit`,
  `Hang Yourself to End Your Miserable Worthless Life`,
  `Hang Yourself to End Your Miserable Life`,
  `Hang Yourself to End Your Worthless Life`,
  `${cringy_name} Recommend You to Hang Yourself`,
  `${cringy_name} Can Help You Hang Yourself`,
  `EZ Pwned by ${cringy_name}`,
  `${cringy_name} Will Keep You MAD`,
  `You Got EZed by ${cringy_name}`,
  `${cringy_name} was in Your House`,
  `${cringy_name} Beated You`,
  `${cringy_name} is Your Boss`,
  `You Must Obey ${cringy_name}`,
  `You Got Ass Fucked by ${cringy_name}`,
  `${cringy_name} Fucked Your Whole Family`,
  `You Poor Degenerate`,
  `EZ Raped`,
  `You got EZed by ${cringy_name} in Node.js`,
  `Have Fun Filtering ${cringy_name} Sticky Cum`,
  `EZ Raped by ${cringy_name}`,
  `${cringy_name} Raped You and Your Whole Family`,
  `Error Logs Goes Brrrrrr on Your Poor Raped Server LMFAO`,
  `Enjoy Your Logs Filled With Sticky White Cum of ${cringy_name}`,
  `Heil ${cringy_name}`
]

// Foul words used as fake names, etc.
let insult_words = [
  'Fuck',
  'Shit',
  'Garbage',
  'Pussy',
  'MotherFucker',
  'LMFAO',
  'SuckMyCock',
  'TasteMyCum',
  'Stupid',
  'Dumbass',
  'Demon',
  'Hahahaha',
  'Noob',
  'L33T',
  'Penis',
  'Semen',
  'BigDick',
  'Poopoo',
  'Fool',
  'Idiot',
  'Shithead',
  'Dickhead',
  'Butthole',
  'Asshole',
  'Degenerate',
  'Scumbag',
  'Scum',
  'Turd',
  'Crap',
  'Bullcrap',
  'Bullshit',
  'DumbFuck',
  'Jizz',
  'Cumshot',
  'Creampie',
  'Cum',
  'Devil',
  'SickFuck',
  'Douchebag',
  'Cock',
  'BigBlackCock',
  'Anal',
  'AssFucked',
  'AIDS',
  'Cancer',
  'DogShit'
];

////////////* END SETTINGS SECTION *////////////

/*
 * Runtime variables and functions below. Do not edit unless needed.
 */

// Interactive readline console object
let reli = null;

// Total number of messages spammed
let spammed_messages_count = 0;

// Parallel spam members alive
let spam_members_alive = spam_members_parallel;

// Termination flag
let stopping = false;

// Errors encountered for each parallel member
let error_counts = new Array(spam_members_parallel);

// Caches for spam messages across stages
let spam_msg_caches = new Array(spam_members_parallel);

// Stage of parallel members
let spam_stages = new Array(spam_members_parallel);

// Incremental message ID for each member
let loop_ids = new Array(spam_members_parallel);

function random_uint32()
{
  return Math.floor(Math.random() * 0x100000000);
}

function random16bytes()
{
  let ret = new Uint8Array(16);
  for(let i = 0 ; i < 16 ; i++)
  {
    ret[i] = Math.floor(Math.random() * 256);
  }
  return ret;
}

// Random machine/account name
function random_machine()
{
  let f = Math.random();
  if(f > 0.875)
  {
    let int0 = random_uint32();
    let ret = '';
    while(int0 > 0)
    {
      ret = `${ret}${String.fromCharCode(int0 % 26 + 65)}`;
      int0 = Math.floor(int0 / 26);
    }
  
    return ret;
  }
  else
  {
    return insult_words[Math.floor(f / 0.875 * insult_words.length)];
  }
}

// Random IPv4
function random_ip()
{
  let int01 = random_uint32();
  let arr01 = new Array(4);
  for(let i = 0 ; i < 4 ; i++)
  {
    arr01[i] = int01 & 0xFF;
    int01 >>= 8;
  }
  return `${arr01[0]}.${arr01[1]}.${arr01[2]}.${arr01[3]}`;
}

// Random lowercase string
function random_name()
{
  let int0 = random_uint32();
  let ret = '';
  while(int0 > 0)
  {
    ret = `${ret}${String.fromCharCode(int0 % 26 + 97)}`;
    int0 = Math.floor(int0 / 26);
  }

  return ret;
}

// Select an insulting line randomly
function random_insult()
{
  return insults[Math.floor(Math.random() * insults.length)];
}

// Random process name entry
function random_process(idx)
{
  let int0 = (idx == 0 ? random_uint32() : idx);
  let int1 = int0 % 4096;

  let name = '';
  while(int0 > 0)
  {
    name = `${String.fromCharCode(int0 % 26 + 97)}${name}`;
    int0 = Math.floor(int0 / 26);
  }

  // In format of "Name: (name.exe), CommandLine: (proc. command line)"
  return `<b:string>ID: ${int1}, Name: ${name}.exe, CommandLine: C:\\${random_insult()}\\${name}.exe</b:string>`;
}

// Random list of fake processes
function random_processes()
{
  let int0 = random_uint32();
  let count = int0 % 32 + 8;
  let ret = '';
  for(let i = 0 ; i < count ; i++)
  {
    ret = `${ret}${random_process(0)}`;
  }
  ret = `${ret}${random_process(int0)}`;
  return ret;
}

// Random installed software entry
function random_software(idx)
{
  let ret = random_insult();

  let int0 = (idx == 0 ? random_uint32() : idx);

  let v0 = int0 % 8;
  int0 = Math.floor(int0 / 8);

  let v1 = int0 % 32;
  int0 = Math.floor(int0 / 32);

  let v2 = int0 % 2048;
  int0 = Math.floor(int0 / 2048);

  let v3 = int0;

  // In format of "Name [Version]"
  return `<b:string>${ret} [${v0}.${v1}.${v2}.${v3}]</b:string>`;
}

// Random list of installed software
function random_softwares()
{
  let int0 = random_uint32();
  let count = int0 % 32 + 8;
  let ret = '';
  for(let i = 0 ; i < count ; i++)
  {
    ret = `${ret}${random_software(0)}`;
  }
  ret = `${ret}${random_software(int0)}`;
  return ret;
}

// Generate random message
function random_msg(idx)
{
  let ret, envelope;

  switch(spam_stages[idx])
  {
    case 0: // Generate brand new message
    {
      spam_msg_caches[idx] = `
         <user xmlns:a="BrowserExtension" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
            <a:City>UNKNOWN</a:City>
            <a:Country>US</a:Country>
            <a:FileLocation>C:\\${random_insult()}\\${random_name()}.exe</a:FileLocation>
            <a:Hardware>${Buffer.from(random16bytes()).toString('hex').toUpperCase()}</a:Hardware>
            <a:IPv4>${random_ip()}</a:IPv4>
            <a:Language>English (United States)</a:Language>
            <a:MachineName>${random_machine()}</a:MachineName>
            <a:Monitor i:nil="true" />
            <a:OSVersion>${random_insult()}</a:OSVersion>
            <a:ReleaseID>sex</a:ReleaseID>
            <a:ScanDetails>
               <a:AvailableLanguages xmlns:b="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
                  <b:string>English (United States)</b:string>
               </a:AvailableLanguages>
               <a:Browsers />
               <a:FtpConnections />
               <a:GameChatFiles>
                  <a:ScannedFile>
                     <a:Body />
                     <a:DirOfFile i:nil="true" />
                     <a:NameOfApplication i:nil="true" />
                     <a:NameOfFile>Tokens.txt</a:NameOfFile>
                     <a:PathOfFile i:nil="true" />
                  </a:ScannedFile>
               </a:GameChatFiles>
               <a:GameLauncherFiles />
               <a:InstalledBrowsers>
                  <a:BrowserVersion>
                     <a:NameOfBrowser>Internet Explorer</a:NameOfBrowser>
                     <a:PathOfFile>C:\\Program Files\\Internet Explorer\\iexplore.exe</a:PathOfFile>
                     <a:Version>11.00.9600.16428 (winblue_gdr.131013-1700)</a:Version>
                  </a:BrowserVersion>
                  <a:BrowserVersion>
                     <a:NameOfBrowser>Google Chrome</a:NameOfBrowser>
                     <a:PathOfFile>C:\\Program Files\\Wavesor\\WaveBrowser\\wavebrowser.exe</a:PathOfFile>
                     <a:Version>v91.0.4472.79</a:Version>
                  </a:BrowserVersion>
               </a:InstalledBrowsers>
               <a:MessageClientFiles />
               <a:Nord />
               <a:Open />
               <a:Processes xmlns:b="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
                  ${random_processes()}
               </a:Processes>
               <a:Proton />
               <a:ScannedFiles />
               <a:ScannedWallets />
               <a:SecurityUtils xmlns:b="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
                  <b:string>${random_insult()}</b:string>
               </a:SecurityUtils>
               <a:Softwares xmlns:b="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
                  ${random_softwares()}
               </a:Softwares>
               <a:SystemHardwares>
                  <a:SystemHardware>
                     <a:Counter>-2048 MB or -2147483648</a:Counter>
                     <a:HardType>Graphic</a:HardType>
                     <a:Name>Total of RAM</a:Name>
                  </a:SystemHardware>
                  <a:SystemHardware>
                     <a:Counter>3</a:Counter>
                     <a:HardType>Processor</a:HardType>
                     <a:Name>${random_insult()} @ 0.00GHz</a:Name>
                  </a:SystemHardware>
               </a:SystemHardwares>
            </a:ScanDetails>
            <a:ScreenSize>{Width=-1000, Height=-500}</a:ScreenSize>
            <a:SeenBefore>false</a:SeenBefore>
            <a:TimeZone>(UTC+00:00) ${random_insult()}</a:TimeZone>
            <a:ZipCode>UNKNOWN</a:ZipCode>
         </user>
      `;
      envelope = 'SetEnvironment';
      break;
    }
    case 1: // Cache will be used
    {
      envelope = 'GetUpdates';
      break;
    }
    default: // Error
    {
      console.error('ERROR: Invalid stage ID in random message generator!');
      return null;
    }
  }

  ret = `
   <?xml version="1.0" encoding="UTF-8"?>
   <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
   <s:Body>
      <${envelope} xmlns="http://tempuri.org/">
      ${spam_msg_caches[idx]}
      </${envelope}>
   </s:Body>
   </s:Envelope>
   `;
  
  return ret.replace(/\r?\n|\r/g, '').replace(/   /g, '');
}

// Spam loop function
function do_spam(idx)
{
  if(stopping)
  {
    return;
  }

  let envelope, next_stage;

  switch(spam_stages[idx])
  {
    case 0: // Send SetEnvironment message
    {
      if(spammed_messages_count >= spam_messages_limit)
      {
        kill_spam_member();
        return;
      }
      loop_ids[idx] = spammed_messages_count;
      spammed_messages_count++;

      envelope = 'SetEnvironment';
      next_stage = 1;

      break;
    }
    case 1: // Send GetUpdates message
    {
      if(debug_mode)
      {
        stopping = true;
      }

      envelope = 'GetUpdates';
      next_stage = 0;

      break;
    }
    default: // Error
    {
      console.error('ERROR: Invalid stage ID in spam loop!');
      kill_spam_member();
      return;
    }
  }

  let content = Buffer.from(random_msg(idx), 'utf8');

  let req1 = http.request(`http://${malware_host}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': `"http://tempuri.org/Endpoint/${envelope}"`,
      'Host': malware_host,
      'Content-Length': `${content.length}`,
      'Expect': '100-continue',
      'Connection': 'Keep-Alive'
    }
  });

  req1.setTimeout(15000);

  req1.flushHeaders();
  req1.on('continue', function() {
    if(debug_mode)
    {
      console.log(content.toString('utf8'));
    }
    req1.end(content);
  });

  req1.on('response', function(resp1) {
    let buf1 = Buffer.allocUnsafe(0);

    resp1.on('data', function(data) {
      buf1 = Buffer.concat([buf1, data]);
    });
    resp1.on('end', function() {
      console.log(util.format('[%s-%s] Received %s response with code: %d.', `0${idx}`.slice(-2), `0000000${loop_ids[idx]}`.slice(-7), envelope, resp1.statusCode));

      if(debug_mode)
      {
        console.log(buf1.toString('utf8'));
      }

      spam_stages[idx] = next_stage;
      setImmediate(do_spam, idx);
    });
  });

  req1.on('error', function(err) {
    if(!stopping)
    {
      if(error_counts[idx] < error_thres)
      {
        error_counts[idx]++;
        setImmediate(do_spam, idx);
      }
      else // Error count exceeds the threshold
      {
        kill_spam_member();
      }
    }
    console.error(err.stack);
  });
}

// Remove a parallel member when needed
function kill_spam_member()
{
  spam_members_alive--;

  // No member is alive, close the console to avoid zombifying
  if(spam_members_alive <= 0)
  {
    reli.close();
  }
}

console.log('---->> Redline Malware C&C Spammer by Atheropids <<----');

// Spawn interactive console when debug = false
if(!debug_mode)
{
  reli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Flag stop when received console command
  reli.on('line', function(line) {
    if(line.toLowerCase() === 'stop')
    {
      stopping = true;
      reli.close();
    }
  });  
}

// Spawn parallel spam members
for(let i = 0 ; i < (debug_mode ? 1 : spam_members_parallel) ; i++)
{
  spam_stages[i] = error_counts[i] = 0;
  do_spam(i);
}
