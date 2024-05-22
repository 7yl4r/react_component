# Run in directory
library(rjson)

work_dir <- '/home/jpthesmithe/Desktop/GLOS_System_Map/2024-code-sprint-param-mapper/react_component/src/vocabulary_json/'

setwd(work_dir)

cf_std_json <- fromJSON(file = "cf_standard.json");
seagull_json <- fromJSON(file = "seagull.json");
dwc_json <- fromJSON(file = "downloaded-dwc.json");

# Add descriptions to the DwC JSON

dwc_meta <- read.csv('term_versions_abbr.csv', TRUE);

dwc_meta_indexed <- list();

for (d in 1:nrow(dwc_meta)) {
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]] = list();
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]][['display_name']] = list();
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]][['display_name']][['en']] = dwc_meta[d, 'label'];
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]][['display_description']] = list();
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]][['display_description']][['en']] = dwc_meta[d, 'definition'];
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]][['comments']] = dwc_meta[d, 'comments'];
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]][['examples']] = dwc_meta[d, 'examples'];
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]][['issued']] = dwc_meta[d, 'issued'];
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]][['status']] = dwc_meta[d, 'status'];
    dwc_meta_indexed[[dwc_meta[d, 'term_localName']]][['replaces']] = dwc_meta[d, 'replaces'];
}

for (dj in 1:length(dwc_json)) {
    curr_meta = dwc_meta_indexed[[dwc_json[[dj]][['standard_name']]]]
    dwc_json[[dj]][['display_name']] = curr_meta[['display_name']];
    dwc_json[[dj]][['display_description']] = curr_meta[['display_description']];
    dwc_json[[dj]][['comments']] = curr_meta[['comments']];
    dwc_json[[dj]][['examples']] = curr_meta[['examples']];
    dwc_json[[dj]][['issued']] = curr_meta[['issued']];
    dwc_json[[dj]][['status']] = curr_meta[['status']];
    dwc_json[[dj]][['replaces']] = curr_meta[['replaces']];
}

seagull_json_glos <- list();
seagull_json_i <- 1

for (i in 1:length(seagull_json)) {
    if (seagull_json[[i]]$name_vocabulary == "glos") {
        seagull_json_glos[[seagull_json_i]] = seagull_json[[i]];
        seagull_json_i <- seagull_json_i + 1;
    }
}

joined_json <- c(cf_std_json, dwc_json, seagull_json_glos);

cf_to_gcmd_keyword_manifest <- file("keywordsCfToGcmd.csv", "r");
cf_to_gcmd_keywords <- readLines(cf_to_gcmd_keyword_manifest);
close(cf_to_gcmd_keyword_manifest);

curr_cf_name = "";
cf_gcmd_map = list();

for (i in 2:length(cf_to_gcmd_keywords)) {
    if (curr_cf_name == "") {
        curr_cf_name = cf_to_gcmd_keywords[i];
        next;
    }
    if (cf_to_gcmd_keywords[i] == "") {
        curr_cf_name = "";
        next;
    }
    cf_gcmd_map[[curr_cf_name]] = c(cf_gcmd_map[[curr_cf_name]], cf_to_gcmd_keywords[i])
}

for (jj in 1:length(joined_json)) {
    if (is.null(cf_gcmd_map[[joined_json[[jj]]$standard_name]])) {
        next;
    }
    joined_json[[jj]][['gcmd_keywords']] = cf_gcmd_map[[joined_json[[jj]]$standard_name]]
}

joined_json_str = toJSON(joined_json, indent = 4);

joined_json_str_out = file("parameter_library.json", 'w');
cat(joined_json_str, file = joined_json_str_out);
close(joined_json_str_out);
