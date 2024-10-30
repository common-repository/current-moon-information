var Currentmoon=function(){
    this.name="currentmoon";
};
Currentmoon.prototype={
    
    open:function(u){
        window.open(u);
    },      
    getImageURL:function(s){
        return (s);
    },
    getMessage:function(s){
        return Currentmoon.tr[s].message;
    },
    /**
     * 
     * @param {object} p must have attributes "e" parent element and "loc" for "northern_hemisphere" or "southern_hemisphere"
     * @returns {undefined}
     */
    create:function(p){
        var dloc=p.loc;
        var dtemp=new Date();
        var ddat=new Date(Date.UTC(dtemp.getFullYear(), dtemp.getMonth(), dtemp.getDate(), 0,0,0));

        var mp=new moonphase(ddat.getTime());
        var nh=dloc==="northern_hemisphere";

        var dhem=this.getMessage(dloc);
        var dilu=Math.round( (100*mp.illum) );
        var dpha=mp.phase.toFixed(2);
        var dage=mp.age;
        var dphasestr= (dpha<= 0.50)?"wax":"wan";
        
        var dmtx=(dilu===0)?(this.getMessage("f1")):(dilu===100)?this.getMessage("f3"):(dphasestr==="wax")?this.getMessage("f2"):this.getMessage("f4");
        var ddst=ddat.toISOString().substring(0,10);
        var durl=to_ascii("http://www.vercalendario.info/"+this.getMessage("l")+"/"+this.getMessage("moon")+"/"+dhem+"-"+this.getMessage("month")+"-"+this.getMessage("m"+(ddat.getUTCMonth()+1))+"-"+ddat.getUTCFullYear()+".html");
        var durt=this.getMessage("href");
        var self=this;
        var mgd=document.getElementById(p.e);
            mgd.style.background="black";
            mgd.style.textAlign="center";
            mgd.style.paddingTop="10px";
        var d0=document.createElement("div");
            d0.appendChild(document.createTextNode(ddst));
            d0.style.color="white";
            d0.style.fontSize="10pt";
        var d1=document.createElement("div");
            d1.appendChild(document.createTextNode(dhem));
            d1.style.color="white";
            d1.style.fontSize="18pt";
        var d2=document.createElement("div");
            d2.style.color="white";
        var ddir= (dpha<= 0.50)?((nh?"wax":"wan")):(nh?"wan":"wax");
        var im=document.createElement("img");
            im.alt=this.getMessage("title");
        var imurl=this.getImageURL('images/'+ddir+'/luna_visible_'+dilu+'.jpg');
            im.src=imurl;
        var aim=document.createElement("a");
            aim.href=durl;
            aim.appendChild(im);
            d2.appendChild(aim);
        var d3=document.createElement("div");
            d3.appendChild(document.createTextNode(dmtx +" "+ dilu+"%"));
            d3.style.color="white";
        var d4=document.createElement("div");
        var a=document.createElement("a");
            a.appendChild(document.createTextNode(durt));
            a.href=durl;
            a.onclick=function(){
                self.open(this.href||durl);
            };
            a.style.color="yellow";
            a.style.fontSize="10pt";
            d4.appendChild(a);
            //*/
            mgd.appendChild(d0);
            mgd.appendChild(d1);
            mgd.appendChild(d2);
            mgd.appendChild(d3);
            mgd.appendChild(d4);
    }
};


    /**
    * Moon phase calculation class
    * Adapted for PHP from Moontool for Windows (http://www.fourmilab.ch/moontoolw/) 
    * by Samir Shah (http://rayofsolaris.net)
    * Last modified August 2010

           This program is free software: you can redistribute it and/or modify
           it under the terms of the GNU General Public License as published by
           the Free Software Foundation, either version 3 of the License, or
           (at your option) any later version.

           This program is distributed in the hope that it will be useful,
           but WITHOUT ANY WARRANTY; without even the implied warranty of
           MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
           GNU General Public License for more details.

           You should have received a copy of the GNU General Public License
           along with this program.  If not, see <http://www.gnu.org/licenses/>.

    *
           USAGE: simply create an instance of the moonphase class, supplying
           a UNIX timestamp for when you want to determine the moon phase. The following
           variables will be created in the resulting object, which you can then access
           from your scripts:
           - phase: the terminator phase angle as a fraction of a full circle (i.e., 0 to 1)
           - illum: the illuminated fraction of the Moon, in degrees
           - age: the Moon's age in days
           - dist: the distance of the Moon from the centre of the Earth
           - angdia: the angular diameter subtended by the Moon as seen by an observer at the centre of the Earth
           - sundist: the distance to the sun in kilometres
           - sunangdia: the angular diameter subtended by the Moon as seen by an observer at the centre of the Earth
    **/
   function moonphase(pdate){
       pdate=pdate/1000;
       this.epoch = 2444238.5;
       this.elonge = 278.833540;		
       this.elongp = 282.596403;		
       this.eccent = 0.016718;			
       this.sunsmax = 1.495985e8;		
       this.sunangsiz = 0.533128;
       this.mmlong = 64.975464;
       this.mmlongp = 349.383063;
       this.mlnode = 151.950429;		
       this.minc = 5.145396;			
       this.mecc = 0.054900;			
       this.mangsiz = 0.5181;			
       this.msmax = 384401;			
       this.mparallax = 0.9507;		
       this.synmonth = 29.53058868;	
       this.lunatbase = 2423436.0;		


       var self=this;
       this.fixangle=function (a) {
           return ( a - 360 * Math.floor(a / 360) );
       };
       this.rad2deg=function(r){
           return (r/Math.PI)*180;
       };
       this.deg2rad=function(d){
           return (Math.PI*d)/180;
       };
       this.kepler=function(m, ecc) {

               epsilon = Math.pow(1, -6);
               e = m = self.deg2rad(m);
               do {
                       delta = e - ecc * Math.sin(e) - m;
                       e -= delta / ( 1 - ecc * Math.cos(e) );
               } 
               while ( Math.abs(delta) > epsilon );
               return e;
       };
       this.pdate =  pdate / 86400 + 2440587.5;
       this.Day = this.pdate - this.epoch;								
       this.N = this.fixangle((360 / 365.2422) * this.Day);		
       this.M = this.fixangle(this.N + this.elonge - this.elongp);		
       this.Ec = this.kepler(this.M, this.eccent);					
       this.Ec = Math.sqrt((1 + this.eccent) / (1 - this.eccent)) * Math.tan(this.Ec / 2);
       this.Ec = 2 * this.rad2deg(Math.atan(this.Ec));						
       this.Lambdasun = this.fixangle(this.Ec + this.elongp);		
       this.F = ((1 + this.eccent * Math.cos(this.deg2rad(this.Ec))) / (1 - this.eccent * this.eccent));	
       this.SunDist = this.sunsmax / this.F;							
       this.SunAng = this.F * this.sunangsiz;							
       this.ml = this.fixangle(13.1763966 * this.Day + this.mmlong);				
       this.MM = this.fixangle(this.ml - 0.1114041 * this.Day - this.mmlongp);		
       this.MN = this.fixangle(this.mlnode - 0.0529539 * this.Day);				
       this.Ev = 1.2739 * Math.sin(this.deg2rad(2 * (this.ml - this.Lambdasun) - this.MM));		
       this.Ae = 0.1858 * Math.sin(this.deg2rad(this.M));								
       this.A3 = 0.37 * Math.sin(this.deg2rad(this.M));									
       this.MmP = this.MM + this.Ev - this.Ae - this.A3;									
       this.mEc = 6.2886 * Math.sin(this.deg2rad(this.MmP));								
       this.A4 = 0.214 * Math.sin(this.deg2rad(2 * this.MmP));							
       this.lP = this.ml + this.Ev + this.mEc - this.Ae + this.A4;								
       this.V = 0.6583 * Math.sin(this.deg2rad(2 * (this.lP - this.Lambdasun)));				
       this.lPP = this.lP + this.V;												
       this.NP = this.MN - 0.16 * Math.sin(this.deg2rad(this.M));							
       this.y = Math.sin(this.deg2rad(this.lPP - this.NP)) * Math.cos(this.deg2rad(this.minc));			
       this.x = Math.cos(this.deg2rad(this.lPP - this.NP));									
       this.Lambdamoon = this.rad2deg(Math.atan2(this.y, this.x)) + this.NP;						
       this.BetaM = this.rad2deg(Math.asin(Math.sin(this.deg2rad(this.lPP - this.NP)) * Math.sin(this.deg2rad(this.minc))));		
       this.MoonAge = this.lPP - this.Lambdasun;								
       this.MoonPhase = (1 - Math.cos(this.deg2rad(this.MoonAge))) / 2;					
       this.MoonDist = (this.msmax * (1 - this.mecc * this.mecc)) / (1 + this.mecc * Math.cos(this.deg2rad(this.MmP + this.mEc)));
       this.MoonDFrac = this.MoonDist / this.msmax;
       this.MoonAng = this.mangsiz / this.MoonDFrac;	
       this.phase = this.fixangle(this.MoonAge) / 360;					
       this.illum = this.MoonPhase;										
       this.age = this.synmonth * this.phase;							
       this.dist = this.MoonDist;										
       this.angdia = this.MoonAng;										
       this.sundist = this.SunDist;										
       this.sunangdia = this.SunAng;
   }


    function to_ascii(s){
        var a=[" ","á","é","í","ó","ú",  "ç","ÿ","ñ",    "ã","ẽ","ĩ","õ","ũ",    "â","ê","î","ô","û","ü",    "à","è","ì","ò","ù",     "ä","ë","ï","ö","ü",
                      "Á","É","Í","Ó","Ú",  "Ç","Ÿ","Ñ",    "Ã","Ẽ","Ĩ","Õ","Ũ",    "Â","Ê","Î","Ô","Û","Ü",    "À","È","Ì","Ò","Ù",     "Ä","Ë","Ï","Ö","Ü" ];
        var b=["_","a","e","i","o","u",  "c","y","n",    "a","e","i","o","u",    "a","e","i","o","u","u",    "a","e","i","o","u",     "a","e","i","o","u",
                      "A","E","I","O","U",  "C","Y","N",    "A","E","I","O","U",    "A","E","I","O","U","U",    "A","E","I","O","U",     "A","E","I","O","U",
                  "_"];
        for(var i=0;i<a.length;i++){
            s=s.replace(a[i],b[i]);
        }return s.toLowerCase();
    }
    