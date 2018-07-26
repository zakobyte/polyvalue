// Miles DeCoster - codeforartists.com
// Sound effects
// Various sounds
// Noise osc, Pulse osc, ADSR envelope and BandPass filter

var noise1;
var myFilter;
var env;
var osc;
var lfo;
var sliderAttack;
var sliderDecay;
var sliderSustain;
var sliderRelease;
var sliderFilterRes;
var sliderFilterFreq;
var sliderPfreq;
var sliderDelay;
var sliderDelayF;
var radio;
var analyzer;
var vol;
var reverb;
var reverbValD;
var reverbValS;

var scaleVal=1;
// store keyCoes for numbers 1 - 8 and letter keys qwertyu
var myKeyCodes = [49, 50, 51, 52, 53, 54, 55, 81, 87,69, 82, 84, 89, 85]; 
var masterGain;

function setup() {
  createCanvas(740, 480);
  fill(0);
  masterGain = new p5.Gain();
  masterGain.connect();
  masterGain.amp(1);
  
  myFilter = new p5.BandPass();
  myFilter.freq(1200);
  myFilter.res(10);
 
  
  env = new p5.Env();
   
  lfo= new p5.Oscillator();
  lfo.setType("sine");
  lfo.freq(1);
   
  osc = new p5.Pulse();
  osc.freq(440);
  osc.amp(env);
  osc.disconnect();
  osc.connect(myFilter);
  osc.start();
  
 
  noise1 = new p5.Noise();
  noise1.amp(env);
  noise1.disconnect();
  noise1.connect(myFilter);
  noise1.start();
  masterGain.setInput(noise1);
  masterGain.setInput(osc);
  
  sliderAttack = createSlider(0, 1000, 180);
  sliderAttack.position(150, 200);
  sliderDecay = createSlider(0, 1000, 180);
  sliderDecay.position(150, 230);
  sliderSustain = createSlider(0, 100, 30);
  sliderSustain.position(150, 260);
  sliderRelease = createSlider(0, 1000, 200);
  sliderRelease.position(150, 290);
  sliderFilterRes = createSlider(1, 100, 50);
  sliderFilterRes.position(300, 200);
  sliderFilterFreq = createSlider(120, 800, 300);
  sliderFilterFreq.position(300, 230);
  sliderPfreq = createSlider(10, 1200, 220);
  sliderPfreq.position(300, 290);
  sliderDelay = createSlider(0, 99, 50);
  sliderDelay.position(300, 322);
  sliderDelayF = createSlider(0, 99, 50);
  sliderDelayF.position(300, 362);
  
  delay = new p5.Delay();
  analyzer = new p5.Amplitude();
  analyzer.setInput(noise1);
  analyzer2 = new p5.Amplitude();
  analyzer2.setInput(delay);
  reverb = new p5.Reverb();
  
}

function draw() {
  background(50);
  vol = analyzer.getLevel();
  vol2 = analyzer2.getLevel();
  myFilter.res(sliderFilterRes.value()/40);
  myFilter.freq(sliderFilterFreq.value());
  
  attackTime=sliderAttack.value()/1000;
  decayTime=sliderDecay.value()/1000;
  susPercent=sliderSustain.value()/100;
  releaseTime=sliderRelease.value()/100;
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  osc.freq(sliderPfreq.value());
  fill(200);
  textSize(20);
  textAlign(LEFT);
  text("Miles DeCoster - codeforartists.com - noiseMaker 1", 20, 40);
  text("Noise oscillator and pulse oscillator with ADSR and BandPass filter", 20, 70);
  text("Attack: "+sliderAttack.value()/1000, 20, 220);
  text("Decay: "+sliderDecay.value()/1000, 20, 250);
  text("Sustain: "+sliderSustain.value()/100, 20, 280);
  text("Release: "+sliderRelease.value()/100, 20, 310);
  text("Filter Resonance: "+sliderFilterRes.value()/40, 470, 220);
  text("Filter Cut Off: "+sliderFilterFreq.value(), 470, 250);
  text("Pulse Frequency: "+sliderPfreq.value(), 470, 300);
  text("Delay: "+sliderDelay.value()/100, 470, 340);
  text("Delay Feedback: "+sliderDelayF.value()/100, 470, 380);
  text("Press 1 to play sound", 20, 400);
  text("Try moving the right side sliders while holding down the 1 key", 20, 430);
  
  
   noStroke();
  
  fill(200, 0, 200, 100);
  ellipse(width/2, height/2, map(vol2, 0, 1, 0, width*2), map(vol2, 0, 1, 0, height*2));
  fill(255, 0, 0, 100);
  ellipse(width/2, height/2, map(vol, 0, 1, 0, width*2), map(vol, 0, 1, 0, height*2));
}

function keyReleased() {
  env.triggerRelease();
}

function keyPressed() {
    if(keyCode == 49) {
     //console.log("1");
     
     delay.process(osc, sliderDelay.value()/100, sliderDelayF.value()/100, 800);
      //delay.process(noise1, sliderReverbD.value(), sliderReverbS.value());
      
      //reverb.process(osc, sliderReverbD.value(), sliderReverbS.value());
      //reverb.process(noise1, sliderReverbD.value(), sliderReverbS.value());
      env.triggerAttack();
  }
}