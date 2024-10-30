<?php
/*
Plugin Name: Current Moon Information
Plugin URI: http://www.vercalendario.info/en/about/extensions/wordpress/install.html#currentmoon
Description: This extension shows you information such as illumination and phase of the current moon as seen either from the northern or southern hemisphere.
Version: 0.0.3
Author: www.vercalendario.info
Author URI: http://www.vercalendario.info/en/
License: http://www.gnu.org/licenses/gpl-2.0.html
*/
/*  Copyright 2013  www.vercalendario.info  (email : info@vercalendario.info)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

class CURRENT_MOON extends WP_Widget {

  //START Thanks to ziggy for yet another code suggestion!
  function __construct() {
  //END
     /* Widget settings. */
    $widget_ops = array(
      'classname' => 'currentmoon',
      'description' => 'This extension shows you information such as illumination and phase of the current moon as seen either from the northern or southern hemisphere.'
    );

     /* Widget control settings. */
    $control_ops = array(
       'width' => 250,
       'height' => 250,
       'id_base' => 'currentmoon-widget');

    /* Create the widget. */
   //$this->WP_Widget('currentmoon-widget', 'Current Moon Information', $widget_ops, $control_ops );
    //START Thanks to ziggy for the code suggestion.
    parent::__construct(
      'currentmoon-widget',
      'Current Moon Information',
      $widget_ops,
      $control_ops);
    //END
  }

  function form ($instance) {
    /* Set up some default widget settings. */
    $defaults = array(
        'loc'=>'nh',
        'lang'=>'en',
    );
    $instance = wp_parse_args( (array) $instance, $defaults ); 
    
    $options_html='';
    if( $instance['loc'] == "northern_hemisphere"){
        $options_html='
            <option selected="selected" value="northern_hemisphere">Northern Hemisphere</option>
            <option value="southern_hemisphere">Southern Hemisphere</option>
        ';
    }else{
        $options_html='
            <option value="northern_hemisphere">Northern Hemisphere</option>
            <option value="southern_hemisphere" selected="selected">Southern Hemisphere</option>
        ';
    }
    
    //generate the language options
    $langs=array("en"=>"English","es"=>"Español","fr"=>"Français","pt"=>"Português","it"=>"Italiano");
    $lang_options_html='';
    foreach ($langs as $langk=>$langv){
        if($langk==$instance["lang"]){
            $sel='selected="selected"';
        }else{
            $sel='';
        }
        $lang_options_html.='<option '.$sel.' value="'.$langk.'">'.$langv.'</option>';
    }
    ?>

  <p>
    <label for="<?php echo $this->get_field_id('loc'); ?>">Select Hemisphere:</label>
    <select name="<?php echo $this->get_field_name('loc') ?>" id="<?php echo $this->get_field_id('loc') ?>">
        <?php echo $options_html; ?>
    </select>
    <br>
    <label for="<?php echo $this->get_field_id('lang'); ?>">Language:</label>
    <select name="<?php echo $this->get_field_name('lang') ?>" id="<?php echo $this->get_field_id('lang') ?>">
        <?php echo $lang_options_html; ?>
    </select>
  </p>
  
  <?php
}

function update ($new_instance, $old_instance) {
  $instance = $old_instance;
  $instance['loc']=$new_instance['loc'];
  $instance['lang']=$new_instance['lang'];
  return $instance;
}

function widget ($args,$instance) {
   extract($args);

  $loc = $instance['loc'];
  if(!isset($instance['loc']) or $instance['loc']==""){
      $loc="en";
  }

  $out='
    <div>
        <div id="currentmoond"></div>
        
        <script type="text/javascript">
            
            function addJs(url,p){
                var e=document.createElement("script");
                    e.type="text/javascript";
                    e.defer=true;
                    e.async=true;
                    e.src=url;
                    if(p){
                        for(var key in p){
                            if(p.hasOwnProperty(key)){
                                e[key]=p[key];
                            }
                        }
                    }
                var ep = document.getElementsByTagName("script")[0];
                    if(!ep){
                        ep.parentNode.insertBefore(e, ep);
                    }else{
                        document.body.appendChild(e);
                    }
            }
            
            addJs("'.plugins_url( '' , __FILE__ ).'/js/currentmoon.js");
            
            
            var currentmoon_check=function(){
                if(typeof Currentmoon=="undefined"){
                    setTimeout(currentmoon_check, 1000);
                }else if(typeof Currentmoon.isLoadingLocale=="undefined"){
                    addJs("'.plugins_url( '' , __FILE__ ).'/js/_locales/'.$instance['lang'].'/messages.js");
                    Currentmoon.isLoadingLocale=true;
                    setTimeout(currentmoon_check, 1000);
                }else if(typeof Currentmoon.tr=="undefined"){
                    setTimeout(currentmoon_check, 1000);
                }else{
                    var vc_currentmoon=new Currentmoon();
                        vc_currentmoon.getImageURL=function(s){return "'. plugins_url( '' , __FILE__ ) .'/"+s;}; 
                    var vc_out_currentmoon=vc_currentmoon.create({e:"currentmoond","loc":"'.$loc.'"});
                }
            };currentmoon_check();
        </script>
    </div>
      ';

  //print the widget for the sidebar
  echo $before_widget;
  echo $before_title.$after_title;
  echo $out;
  echo $after_widget;
 }
}

function currentmoon_load_widget() {
  register_widget('CURRENT_MOON');
}

add_action('widgets_init', 'currentmoon_load_widget');

?>