<!-- geo_mashup_location_editor -->
<div id="geo_mashup_post_edit" class="postbox " >
<div class="handlediv" title="Click to toggle"><br /></div><h3 class='hndle'><span>Location</span></h3>
<div class="inside">
	<div id="geo_mashup_location_editor">
	<div id="geo_mashup_ajax_message" class="geo-mashup-js ui-state-highlight"></div>
	<input id="geo_mashup_nonce" name="geo_mashup_nonce" type="hidden" value="7905e2af2d" />
	<input id="geo_mashup_changed" name="geo_mashup_changed" type="hidden" value="" />
			
		<label for="geo_mashup_search">Find a new location:	<input	id="geo_mashup_search" name="geo_mashup_search" type="text" size="35" />
	</label>

	or select from 
	<select id="geo_mashup_select" name="geo_mashup_select"> 
		<option value="">[Saved Locations]</option>
		<option value="7|42.3736153|-71.1097336|Cambridge, MA, USA">Cafe Luna Cambridge</option>	</select>
		<div id="geo_mashup_map" class="geo-mashup-js">
		Loading Google map. Check Geo Mashup options if the map fails to load.	</div>
			<table id="geo-mashup-location-table">
		<thead class="ui-widget-header">
		<tr>
			<th>Address</th>
			<th>Saved Name</th>
			<th>Geo Date</th>
		</tr>
		</thead>
		<tbody class="ui-widget-content">
		<tr id="geo_mashup_display" class="geo-mashup-display-row">
			<td class="geo-mashup-info">
				<div class="geo-mashup-address"></div>
				<div class="geo-mashup-coordinates"></div>
			</td>
			<td id="geo_mashup_saved_name_ui">
				<input id="geo_mashup_location_name" name="geo_mashup_location_name" size="50" type="text" value="" />
			</td>
			<td id="geo_mashup_date_ui">
				<input id="geo_mashup_date" name="geo_mashup_date" type="text" size="20" value="Apr 9, 2013" /><br />
				@
				<input id="geo_mashup_hour" name="geo_mashup_hour" type="text" size="2" maxlength="2" value="5" />
				:
				<input id="geo_mashup_minute" name="geo_mashup_minute" type="text" size="2" maxlength="2" value="35" />
			</td>
			<td id="geo_mashup_ajax_buttons">
			</td>

		</tr>
		</tbody>
	</table>
	
	<input id="geo_mashup_ui_manager" name="geo_mashup_ui_manager" type="hidden" value="GeoMashupPostUIManager" />
	<input id="geo_mashup_object_id" name="geo_mashup_object_id" type="hidden" value="401" />
	<input id="geo_mashup_no_js" name="geo_mashup_no_js" type="hidden" value="true" />
	<input id="geo_mashup_location_id" name="geo_mashup_location_id" type="hidden" value="" />
	<input id="geo_mashup_location" name="geo_mashup_location" type="hidden" value="" />
	<input id="geo_mashup_geoname" name="geo_mashup_geoname" type="hidden" value="" />
	<input id="geo_mashup_address" name="geo_mashup_address" type="hidden" value="" />
	<input id="geo_mashup_postal_code" name="geo_mashup_postal_code" type="hidden" value="" />
	<input id="geo_mashup_country_code" name="geo_mashup_country_code" type="hidden" value="" />
	<input id="geo_mashup_admin_code" name="geo_mashup_admin_code" type="hidden" value="" />
	<input id="geo_mashup_admin_name" name="geo_mashup_admin_name" type="hidden" value="" />
	<input id="geo_mashup_kml_url" name="geo_mashup_kml_url" type="hidden" value="" />
	<input id="geo_mashup_sub_admin_code" name="geo_mashup_sub_admin_code" type="hidden" value="" />
	<input id="geo_mashup_sub_admin_name" name="geo_mashup_sub_admin_name" type="hidden" value="" />
	<input id="geo_mashup_locality_name" name="geo_mashup_locality_name" type="hidden" value="" />
	<div id="geo_mashup_submit" class="submit">
		<input id="geo_mashup_add_location" name="geo_mashup_add_location" type="submit"  value="Add Location" />
		<input id="geo_mashup_delete_location" name="geo_mashup_delete_location" type="submit" style="display:none;" value="Delete" />
		<input id="geo_mashup_update_location" name="geo_mashup_update_location" type="submit" style="display:none;" value="Save" />
	</div>
	<div id="geo-mashup-inline-help-link-wrap" class="geo-mashup-js">
		<a href="#geo-mashup-inline-help" id="geo-mashup-inline-help-link">help<span class="ui-icon ui-icon-triangle-1-s"></span></a>
	</div>
	<div id="geo-mashup-inline-help" class=" ui-widget-content">
		<p><em>Saved Name</em> is an optional name you may use to add entries to the Saved Locations menu.</p>
		<p><em>Geo Date</em> associates a date (most formats work) and time with a location. Leave the default value if uncertain.</p>
		<div class="geo-mashup-js">
			<p>Put a green pin at a new location. There are many ways to do it:</p>
			<ul>
				<li>Search for a location name.</li>
				<li>For multiple search results, mouse over pins to see location names, and click a result pin to select that location.</li>
				<li>Search for a decimal latitude and longitude separated by a comma, like <em>40.123,-105.456</em>. Seven decimal places are stored. Negative latitude is used for the southern hemisphere, and negative longitude for the western hemisphere.</li> 
				<li>Search for a street address, like <em>123 main st, anytown, acity</em>.</li>
				<li>Click on the location. Zoom in if necessary so you can refine the location by dragging it or clicking a new location.</li>
			</ul>
			<p>To execute a search, type search text into the Find Location box and hit the enter key. If you type a name next to "Save As", the location will be saved under that name and added to the Saved Locations dropdown list.</p>
			<p>To remove the location (green pin), clear the search box and hit the enter key.</p>
			<p>When you are satisfied with the location, save or update.</p>
		</div>
		<noscript>
			<div>
				<p>To add or update location choose a saved location, or find a new location using one of these formats:</p>
				<ul>
					<li>A place name like <em>Yellowstone National Park</em></li>
					<li>A decimal latitude and longitude, like <em>40.123,-105.456</em>.</li> 
					<li>A full or partial street address, like <em>123 main st, anytown, acity 12345 USA</em>.</li>
				</ul>
				<p>When you save or update, the closest match available will be saved as the location.</p>
			</div>
		</noscript>

	</div>
	<!-- geo_mashup_location_editor -->
