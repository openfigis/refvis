/**************************************************************/
/* Prepares the cv to be dynamically expandable/collapsible   */
/**************************************************************/
function prepareList(id) {
	//$(id).sliderDestroy();
	$(id).slider();
};


function generateGroupList(response, arrayOfConcepts) {
	if (response.children != undefined) {
		for (var index = 0; index < response['children'].length; index++) {
			var concept = {};
			if (response['children'][index]['child'][0]['concept'][0]['multilingualName'] != undefined) {
				concept.name_en = response['children'][index]['child'][0]['concept'][0]['multilingualName']['EN'];
				concept.name_fr = response['children'][index]['child'][0]['concept'][0]['multilingualName']['FR'];
				concept.name_es = response['children'][index]['child'][0]['concept'][0]['multilingualName']['ES'];
			}
			if (response['children'][index]['child'][0]['concept'][0]['multilingualLongName'] != undefined) {
				concept.long_name_en = response['children'][index]['child'][0]['concept'][0]['multilingualLongName']['EN'];
				concept.long_name_fr = response['children'][index]['child'][0]['concept'][0]['multilingualLongName']['FR'];
				concept.long_name_es = response['children'][index]['child'][0]['concept'][0]['multilingualLongName']['ES'];
			}
			if (response['children'][index]['child'][0]['concept'][0]['multilingualFullName'] != undefined) {
				concept.full_name_en = response['children'][index]['child'][0]['concept'][0]['multilingualFullName']['EN'];
				concept.full_name_fr = response['children'][index]['child'][0]['concept'][0]['multilingualFullName']['FR'];
				concept.full_name_es = response['children'][index]['child'][0]['concept'][0]['multilingualFullName']['ES'];
			}
			if (response['children'][index]['child'][0]['concept'][0]['multilingualOfficialName'] != undefined) {
				concept.official_name_en = response['children'][index]['child'][0]['concept'][0]['multilingualOfficialName']['EN'];
				concept.official_name_fr = response['children'][index]['child'][0]['concept'][0]['multilingualOfficialName']['FR'];
				concept.official_name_es = response['children'][index]['child'][0]['concept'][0]['multilingualOfficialName']['ES'];
			}
			if (response['children'][index]['child'][0]['concept'][0]['hierarchy'] != undefined) {
				concept.hierarchy = [];
				concept.hierarchy = generateGroupList(response['children'][index]['child'][0]['concept'][0]['hierarchy'], []);
			}
			if (response['children'][index]['child'][0]['concept'][0]['link'] != undefined) {
				concept.link = response['children'][index]['child'][0]['concept'][0]['link'][0]['href'];
			}
			arrayOfConcepts.push(concept);
		}	
	}
	else {
		for (var index = 0; index < response.length; index++) {
			var concept = {};
			if (response[index]['multilingualName'] != undefined) {
				concept.name_en = response[index]['multilingualName']['EN'];
				concept.name_fr = response[index]['multilingualName']['FR'];
				concept.name_es = response[index]['multilingualName']['ES'];
			}
			if (response[index]['multilingualLongName'] != undefined) {
				concept.long_name_en = response[index]['multilingualLongName']['EN'];
				concept.long_name_fr = response[index]['multilingualLongName']['FR'];
				concept.long_name_es = response[index]['multilingualLongName']['ES'];
			}
			if (response[index]['multilingualFullName'] != undefined) {
				concept.full_name_en = response[index]['multilingualFullName']['EN'];
				concept.full_name_fr = response[index]['multilingualFullName']['FR'];
				concept.full_name_es = response[index]['multilingualFullName']['ES'];
			}
			if (response[index]['multilingualOfficialName'] != undefined) {
				concept.official_name_en = response[index]['multilingualOfficialName']['EN'];
				concept.official_name_fr = response[index]['multilingualOfficialName']['FR'];
				concept.official_name_es = response[index]['multilingualOfficialName']['ES'];
			}
			if (response[index]['hierarchy'] != undefined) {
				concept.hierarchy = [];
				concept.hierarchy = generateGroupList(response[index]['hierarchy'], []);
			}
			if (response[index]['link'] != undefined) {
				concept.link = response[index]['link'][0]['href'];
			}
			arrayOfConcepts.push(concept);
		}
	}
	return arrayOfConcepts;
}

function hasHierarchy(hierarchy) {
	if (hierarchy == undefined) {
		return false;
	} 
	if (hierarchy['parents'] == undefined && hierarchy['childrens']) { 				
		return false; 
	}
	if (hierarchy['children'][0]['child'] == undefined && hierarchy['parents'][0]['parent'] == undefined) { 	
		return false; 
	}
	return true;
}

function parseConceptList(response) {
	window['refvis']['last_response'] = response;
	var arrayOfConcepts = [];
	if (response[0] != undefined) {
		if (hasHierarchy(response[0]['hierarchy'])) {
		//if (response[0]['hierarchy'] != undefined) {
			arrayOfConcepts = generateGroupList(response, arrayOfConcepts);
			arrayOfConcepts['type'] = 'group_list';
			return arrayOfConcepts;
		}
	}
	for (index = 0, len = response.length; index < len; ++index) {
		var res = {}
		res['name'] = {};
		var hasName = false;
		if (response[index].name != undefined) {
			res['name']['en'] = response[index].name;
			res['name']['es'] = response[index].name;
			res['name']['fr'] = response[index].name;
			res['name']['ar'] = response[index].name;
			res['name']['ru'] = response[index].name;
			res['name']['zh'] = response[index].name;
			hasName = true;
		}
		if (response[index].multilingualLongName != undefined) {
			if (hasName == false) {
				res['name']['en'] = response[index].multilingualLongName.EN;
				res['name']['es'] = response[index].multilingualLongName.ES;
				res['name']['fr'] = response[index].multilingualLongName.FR;
				res['name']['ar'] = response[index].multilingualLongName.AR;
				res['name']['ru'] = response[index].multilingualLongName.RU;
				res['name']['zh'] = response[index].multilingualLongName.ZH;
				hasName = true;            
			} else {
				res['multilingualLongName'] = {};
				res['multilingualLongName']['en'] = response[index].multilingualLongName.EN;
				res['multilingualLongName']['es'] = response[index].multilingualLongName.ES;
				res['multilingualLongName']['fr'] = response[index].multilingualLongName.FR;
				res['multilingualLongName']['ar'] = response[index].multilingualLongName.AR;
				res['multilingualLongName']['ru'] = response[index].multilingualLongName.RU;
				res['multilingualLongName']['zh'] = response[index].multilingualLongName.ZH;
			}
		}
		if (response[index].multilingualOfficialName != undefined) {
			if (hasName == false) {
				res['name']['en'] = response[index].multilingualOfficialName.EN;
				res['name']['es'] = response[index].multilingualOfficialName.ES;
				res['name']['fr'] = response[index].multilingualOfficialName.FR;
				res['name']['ar'] = response[index].multilingualOfficialName.AR;
				res['name']['ru'] = response[index].multilingualOfficialName.RU;
				res['name']['zh'] = response[index].multilingualOfficialName.ZH;
				hasName = true;            
			} else {
				res['multilingualOfficialName'] = {};
				res['multilingualOfficialName']['en'] = response[index].multilingualOfficialName.EN;
				res['multilingualOfficialName']['es'] = response[index].multilingualOfficialName.ES;
				res['multilingualOfficialName']['fr'] = response[index].multilingualOfficialName.FR;
				res['multilingualOfficialName']['ar'] = response[index].multilingualOfficialName.AR;
				res['multilingualOfficialName']['ru'] = response[index].multilingualOfficialName.RU;
				res['multilingualOfficialName']['zh'] = response[index].multilingualOfficialName.ZH;
			}
		}
		
		if (response[index].multilingualName != undefined) {
			if (hasName == false) {
				res['name']['en'] = response[index].multilingualName.EN;
				res['name']['es'] = response[index].multilingualName.ES;
				res['name']['fr'] = response[index].multilingualName.FR;
				res['name']['ar'] = response[index].multilingualName.AR;
				res['name']['ru'] = response[index].multilingualName.RU;
				res['name']['zh'] = response[index].multilingualName.ZH;
				hasName = true;  
			} else {
				res['multilingualName'] = {};
				res['multilingualName']['en'] = response[index].multilingualName.EN;
				res['multilingualName']['es'] = response[index].multilingualName.ES;
				res['multilingualName']['fr'] = response[index].multilingualName.FR;
				res['multilingualName']['ar'] = response[index].multilingualName.AR;
				res['multilingualName']['ru'] = response[index].multilingualName.RU;
				res['multilingualName']['zh'] = response[index].multilingualName.ZH;
			}
		}
		if (response[index].multilingualFullName != undefined) {
			if (hasName == false) {
				res['name']['en'] = response[index].multilingualFullName.EN;
				res['name']['es'] = response[index].multilingualFullName.ES;
				res['name']['fr'] = response[index].multilingualFullName.FR;
				res['name']['ar'] = response[index].multilingualFullName.AR;
				res['name']['ru'] = response[index].multilingualFullName.RU;
				res['name']['zh'] = response[index].multilingualFullName.ZH;
				hasName = true;            
			} else {
				res['multilingualFullName'] = {};
				res['multilingualFullName']['en'] = response[index].multilingualFullName.EN;
				res['multilingualFullName']['es'] = response[index].multilingualFullName.ES;
				res['multilingualFullName']['fr'] = response[index].multilingualFullName.FR;
				res['multilingualFullName']['ar'] = response[index].multilingualFullName.AR;
				res['multilingualFullName']['ru'] = response[index].multilingualFullName.RU;
				res['multilingualFullName']['zh'] = response[index].multilingualFullName.ZH;
			}
		}
		if (response[index].scientific_name != undefined) {
			if (hasName == false) {
				res['name']['en'] = response[index].scientific_name;
				res['name']['es'] = response[index].scientific_name;
				res['name']['fr'] = response[index].scientific_name;
				res['name']['ar'] = response[index].scientific_name;
				res['name']['ru'] = response[index].scientific_name;
				res['name']['zh'] = response[index].scientific_name;
				hasName = true;            
			} else {
				res['scientific_name'] = response[index].scientific_name;
			}
		}
		if (response[index].vessel_name != undefined) {		
			if (hasName == false) {
				res['name']['en'] = response[index].vessel_name;
				res['name']['es'] = response[index].vessel_name;
				res['name']['fr'] = response[index].vessel_name;
				res['name']['ar'] = response[index].vessel_name;
				res['name']['ru'] = response[index].vessel_name;
				res['name']['zh'] = response[index].vessel_name;
				hasName = true;			
			} else {
				res['vessel_name'] = response[index].vessel_name;
			}
		}

		var href = "";
		var href_type = "figis_group"
		if (response[index].link != undefined) {
			res['list'] = response[index].link[0].href;	
			href = Base64.encode(response[index].link[0].href.replace(BASE_URL, "") + "!~~!" + res['name']['en']); //HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
			if (response[index].link[0].rel != "figis_group") {
				href_type = "anchor";
			}
		}
		
		arrayOfConcepts.push({"vals" : res, "href" : href, "href_type" : href_type});
		arrayOfConcepts['type'] = 'concept_list';
	}
	return arrayOfConcepts;
}

function parseItem(item) {
	var res = {};

	if (item.scientific_name != undefined && item.scientific_name != null) {
		res['scientific_name'] = {};
		res['scientific_name']['en'] = item.scientific_name;
		res['scientific_name']['es'] = item.scientific_name;
		res['scientific_name']['fr'] = item.scientific_name;
		res['scientific_name']['ar'] = item.scientific_name;
		res['scientific_name']['zh'] = item.scientific_name;
		res['scientific_name']['ru'] = item.scientific_name;
	}
	var hasName = {'en' : false, 'fr' : false, 'es' : false, 'zh' : false, 'ru' : false, 'ar' : false};
	res['multilingualName'] = {};
	res['name'] = {};
	if (item.name_e != undefined && item.name_e != null) {
		res['multilingualName']['en'] = item.name_e;
		res['name']['en'] = item.name_e;
		hasName.en = true;
	}
	if (item.name_f != undefined && item.name_f != null) {
		res['multilingualName']['fr'] = item.name_f;
		res['name']['fr'] = item.name_f;
		hasName.fr = true;
	}
	if (item.name_s != undefined && item.name_s != null) {
		res['multilingualName']['es'] = item.name_s;
		res['name']['es'] = item.name_s;
		hasName.es = true;
	}
	if (item.name_a != undefined && item.name_a != null) {
		res['multilingualName']['ar'] = item.name_a;
		res['name']['ar'] = item.name_a;
		hasName.a = true;
	}
	if (item.name_r != undefined && item.name_r != null) {
		res['multilingualName']['ru'] = item.name_r;
		res['name']['ru'] = item.name_r;
		hasName.ru = true;
	}
	if (item.name_c != undefined && item.name_c != null) {
		res['multilingualName']['zh'] = item.name_c;
		res['name']['zh'] = item.name_c;
		hasName.zh = true;
	}
	res['multilingualFullName'] = {};
	if (item.full_name_e != undefined && item.full_name_e != null) {
		res['multilingualFullName']['en'] = item.full_name_e;
		if (!hasName.en) {
			res['name']['en'] = item.full_name_e;
			hasName.en = true;
		}
	}
	if (item.full_name_f != undefined && item.full_name_f != null) {
		res['multilingualFullName']['fr'] = item.full_name_f;
		if (!hasName.fr) {
			res['name']['fr'] = item.full_name_f;
			hasName.fr = true;
		}
	}
	if (item.full_name_s != undefined && item.full_name_s != null) {
		res['multilingualFullName']['es'] = item.full_name_s;
		if (!hasName.es) {
			res['name']['es'] = item.full_name_s;
			hasName.es = true;
		}
	}
	if (item.full_name_a != undefined && item.full_name_a != null) {
		res['multilingualFullName']['ar'] = item.full_name_a;
		if (!hasName.ar) {
			res['name']['ar'] = item.full_name_a;
			hasName.ar = true;
		}
	}
	if (item.full_name_r != undefined && item.full_name_r != null) {
		res['multilingualFullName']['ru'] = item.full_name_r;
		if (!hasName.ru) {
			res['name']['ru'] = item.full_name_r;
			hasName.ru = true;
		}
	}
	if (item.full_name_c != undefined && item.full_name_c != null) {
		res['multilingualFullName']['zh'] = item.full_name_c;
		if (!hasName.zh) {
			res['name']['zh'] = item.full_name_c;
			hasName.zh = true;
		}
	}
	res['multilingualLongName'] = {};
	if (item.long_name_e != undefined && item.long_name_e != null) {
		res['multilingualLongName']['en'] = item.long_name_e;
		if (!hasName.en) {
			res['name']['en'] = item.long_name_e;
			hasName.en = true;
		}
	}
	if (item.long_name_f != undefined && item.long_name_f != null) {
		res['multilingualLongName']['fr'] = item.long_name_f;
		if (!hasName.fr) {
			res['name']['fr'] = item.long_name_f;
			hasName.fr = true;
		}
	}
	if (item.long_name_s != undefined && item.long_name_s != null) {
		res['multilingualLongName']['es'] = item.long_name_s;
		if (!hasName.es) {
			res['name']['es'] = item.long_name_s;
			hasName.es = true;
		}
	}
	if (item.long_name_a != undefined && item.long_name_a != null) {
		res['multilingualLongName']['ar'] = item.long_name_a;
		if (!hasName.ar) {
			res['name']['ar'] = item.long_name_a;
			hasName.ar = true;
		}
	}
	if (item.long_name_r != undefined && item.long_name_r != null) {
		res['multilingualLongName']['ru'] = item.long_name_r;
		if (!hasName.ru) {
			res['name']['ru'] = item.long_name_r;
			hasName.ru = true;
		}
	}
	if (item.long_name_c != undefined && item.long_name_c != null) {
		res['multilingualLongName']['zh'] = item.long_name_c;
		if (!hasName.zh) {
			res['name']['zh'] = item.long_name_c;
			hasName.zh = true;
		}
	}

	res['multilingualOfficialName'] = {};
	if (item.official_name_e != undefined && item.official_name_e != null) {
		res['multilingualOfficialName']['en'] = item.official_name_e;
		if (!hasName.en) {
			res['name']['en'] = item.official_name_e;
			hasName.en = true;
		}
	}
	if (item.official_name_f != undefined && item.official_name_f != null) {
		res['multilingualOfficialName']['fr'] = item.official_name_f;
		if (!hasName.fr) {
			res['name']['fr'] = item.official_name_f;
			hasName.fr = true;
		}
	}
	if (item.official_name_s != undefined && item.official_name_s != null) {
		res['multilingualOfficialName']['es'] = item.official_name_s;
		if (!hasName.es) {
			res['name']['es'] = item.official_name_s;
			hasName.es = true;
		}
	}
	if (item.official_name_a != undefined && item.official_name_a != null) {
		res['multilingualOfficialName']['ar'] = item.official_name_a;
		if (!hasName.ar) {
			res['name']['ar'] = item.official_name_a;
			hasName.ar = true;
		}
	}
	if (item.official_name_r != undefined && item.official_name_r != null) {
		res['multilingualOfficialName']['ru'] = item.official_name_r;
		if (!hasName.ru) {
			res['name']['ru'] = item.official_name_r;
			hasName.ru = true;
		}
	}
	if (item.official_name_c != undefined && item.official_name_c != null) {
		res['multilingualOfficialName']['zh'] = item.official_name_c;
		if (!hasName.zh) {
			res['name']['zh'] = item.official_name_c;
			hasName.zh = true;
		}
	}
	return res;

}

function parseConcept(response) {
	window['refvis']['last_response'] = response;
	var arrayOfConcepts = [];

	if (response['link'] != undefined) {
		arrayOfConcepts['XML'] = response['link'][0]['href'] + "xml";
		arrayOfConcepts['JSON'] = response['link'][0]['href'] + "json";
		arrayOfConcepts['CONCEPT'] = response['link'][0]['rel'];
	}
	var hasName = false;
	res = {};
	res['name'] = {};
	if (response.name != undefined) {
		res['name']['en'] = response.name;
		res['name']['es'] = response.name;
		res['name']['fr'] = response.name;
		res['name']['ar'] = response.name;
		res['name']['ru'] = response.name;
		res['name']['zh'] = response.name;
		hasName = true;
	}
	if (response.multilingualName != undefined) {
		var translations = getTranslationChecker();
		res['multilingualName'] = {};

		if (response.multilingualName.EN != undefined) {
			res['multilingualName']['default'] = response.multilingualName.EN;
			translations.en = true;
		} else if (response.multilingualName.FR != undefined) {
			res['multilingualName']['default'] = response.multilingualName.FR;
			translations.fr = true;
		} else if (response.multilingualName.ES != undefined) {
			res['multilingualName']['default'] = response.multilingualName.ES;
			translations.es = true;
		} else if (response.multilingualName.RU != undefined) {
			res['multilingualName']['default'] = response.multilingualName.RU;
			translations.ru = true;
		} else if (response.multilingualName.ZH != undefined) {
			res['multilingualName']['default'] = response.multilingualName.ZH;
			translations.zh = true;
		} else if (response.multilingualName.AR != undefined) {
			res['multilingualName']['default'] = response.multilingualName.AR;
			translations.ar = true;
		}
		res['multilingualName']['translations'] = {}
		if (response.multilingualName.EN != undefined && translations.en == false) {
			res['multilingualName']['translations']['en'] = response.multilingualName.EN;
		}
		if (response.multilingualName.FR != undefined && translations.fr == false) {
			res['multilingualName']['translations']['fr'] = response.multilingualName.FR;
		}
		if (response.multilingualName.ES != undefined && translations.es == false) {
			res['multilingualName']['translations']['es'] = response.multilingualName.ES;
		}
		if (response.multilingualName.RU != undefined && translations.ru == false) {
			res['multilingualName']['translations']['ru'] = response.multilingualName.RU;
		}
		if (response.multilingualName.ZH != undefined && translations.zh == false) {
			res['multilingualName']['translations']['zh'] = response.multilingualName.ZH;
		}
		if (response.multilingualName.AR != undefined && translations.ar == false) {
			res['multilingualName']['translations']['ar'] = response.multilingualName.AR;
		}
		hasName = true;     
	}
	if (response.multilingualLongName != undefined) {
		var translations = getTranslationChecker();
		res['multilingualLongName'] = {};

		if (response.multilingualLongName.EN != undefined) {
			res['multilingualLongName']['default'] = response.multilingualLongName.EN;
			translations.en = true;
		} else if (response.multilingualLongName.FR != undefined) {
			res['multilingualLongName']['default'] = response.multilingualLongName.FR;
			translations.fr = true;
		} else if (response.multilingualLongName.ES != undefined) {
			res['multilingualLongName']['default'] = response.multilingualLongName.ES;
			translations.es = true;
		} else if (response.multilingualLongName.RU != undefined) {
			res['multilingualLongName']['default'] = response.multilingualLongName.RU;
			translations.ru = true;
		} else if (response.multilingualLongName.ZH != undefined) {
			res['multilingualLongName']['default'] = response.multilingualLongName.ZH;
			translations.zh = true;
		} else if (response.multilingualLongName.AR != undefined) {
			res['multilingualLongName']['default'] = response.multilingualLongName.AR;
			translations.ar = true;
		}
		res['multilingualLongName']['translations'] = {}
		if (response.multilingualLongName.EN != undefined && translations.en == false) {
			res['multilingualLongName']['translations']['en'] = response.multilingualLongName.EN;
		}
		if (response.multilingualLongName.FR != undefined && translations.fr == false) {
			res['multilingualLongName']['translations']['fr'] = response.multilingualLongName.FR;
		}
		if (response.multilingualLongName.ES != undefined && translations.es == false) {
			res['multilingualLongName']['translations']['es'] = response.multilingualLongName.ES;
		}
		if (response.multilingualLongName.RU != undefined && translations.ru == false) {
			res['multilingualLongName']['translations']['ru'] = response.multilingualLongName.RU;
		}
		if (response.multilingualLongName.ZH != undefined && translations.zh == false) {
			res['multilingualLongName']['translations']['zh'] = response.multilingualLongName.ZH;
		}
		if (response.multilingualLongName.AR != undefined && translations.ar == false) {
			res['multilingualLongName']['translations']['ar'] = response.multilingualLongName.AR;
		}
	}
	if (response.multilingualOfficialName != undefined) {
		var translations = getTranslationChecker();
		res['multilingualOfficialName'] = {};

		if (response.multilingualOfficialName.EN != undefined) {
			res['multilingualOfficialName']['default'] = response.multilingualOfficialName.EN;
			translations.en = true;
		} else if (response.multilingualOfficialName.FR != undefined) {
			res['multilingualOfficialName']['default'] = response.multilingualOfficialName.FR;
			translations.fr = true;
		} else if (response.multilingualOfficialName.ES != undefined) {
			res['multilingualOfficialName']['default'] = response.multilingualOfficialName.ES;
			translations.es = true;
		} else if (response.multilingualOfficialName.RU != undefined) {
			res['multilingualOfficialName']['default'] = response.multilingualOfficialName.RU;
			translations.ru = true;
		} else if (response.multilingualOfficialName.ZH != undefined) {
			res['multilingualOfficialName']['default'] = response.multilingualOfficialName.ZH;
			translations.zh = true;
		} else if (response.multilingualOfficialName.AR != undefined) {
			res['multilingualOfficialName']['default'] = response.multilingualOfficialName.AR;
			translations.ar = true;
		}
		res['multilingualOfficialName']['translations'] = {}
		if (response.multilingualOfficialName.EN != undefined && translations.en == false) {
			res['multilingualOfficialName']['translations']['en'] = response.multilingualOfficialName.EN;
		}
		if (response.multilingualOfficialName.FR != undefined && translations.fr == false) {
			res['multilingualOfficialName']['translations']['fr'] = response.multilingualOfficialName.FR;
		}
		if (response.multilingualOfficialName.ES != undefined && translations.es == false) {
			res['multilingualOfficialName']['translations']['es'] = response.multilingualOfficialName.ES;
		}
		if (response.multilingualOfficialName.RU != undefined && translations.ru == false) {
			res['multilingualOfficialName']['translations']['ru'] = response.multilingualOfficialName.RU;
		}
		if (response.multilingualOfficialName.ZH != undefined && translations.zh == false) {
			res['multilingualOfficialName']['translations']['zh'] = response.multilingualOfficialName.ZH;
		}
		if (response.multilingualOfficialName.AR != undefined && translations.ar == false) {
			res['multilingualOfficialName']['translations']['ar'] = response.multilingualOfficialName.AR;
		}
	}
	if (response.multilingualFullName != undefined) {
		var translations = getTranslationChecker();
		res['multilingualFullName'] = {};

		if (response.multilingualFullName.EN != undefined) {
			res['multilingualFullName']['default'] = response.multilingualFullName.EN;
			translations.en = true;
		} else if (response.multilingualFullName.FR != undefined) {
			res['multilingualFullName']['default'] = response.multilingualFullName.FR;
			translations.fr = true;
		} else if (response.multilingualFullName.ES != undefined) {
			res['multilingualFullName']['default'] = response.multilingualFullName.ES;
			translations.es = true;
		} else if (response.multilingualFullName.RU != undefined) {
			res['multilingualFullName']['default'] = response.multilingualFullName.RU;
			translations.ru = true;
		} else if (response.multilingualFullName.ZH != undefined) {
			res['multilingualFullName']['default'] = response.multilingualFullName.ZH;
			translations.zh = true;
		} else if (response.multilingualFullName.AR != undefined) {
			res['multilingualFullName']['default'] = response.multilingualFullName.AR;
			translations.ar = true;
		}
		res['multilingualFullName']['translations'] = {}
		if (response.multilingualFullName.EN != undefined && translations.en == false) {
			res['multilingualFullName']['translations']['en'] = response.multilingualFullName.EN;
		}
		if (response.multilingualFullName.FR != undefined && translations.fr == false) {
			res['multilingualFullName']['translations']['fr'] = response.multilingualFullName.FR;
		}
		if (response.multilingualFullName.ES != undefined && translations.es == false) {
			res['multilingualFullName']['translations']['es'] = response.multilingualFullName.ES;
		}
		if (response.multilingualFullName.RU != undefined && translations.ru == false) {
			res['multilingualFullName']['translations']['ru'] = response.multilingualFullName.RU;
		}
		if (response.multilingualFullName.ZH != undefined && translations.zh == false) {
			res['multilingualFullName']['translations']['zh'] = response.multilingualFullName.ZH;
		}
		if (response.multilingualFullName.AR != undefined && translations.ar == false) {
			res['multilingualFullName']['translations']['ar'] = response.multilingualFullName.AR;
		}
	}
	if (response.scientific_name != undefined) {
		res['scientific_name'] = response.scientific_name;
		res['scientific_name']['en'] = response.scientific_name;
		res['scientific_name']['es'] = response.scientific_name;
		res['scientific_name']['fr'] = response.scientific_name;
		res['scientific_name']['ar'] = response.scientific_name;
		res['scientific_name']['ru'] = response.scientific_name;
		res['scientific_name']['zh'] = response.scientific_name;
		if (hasName == false) {
			res['name']['en'] = response.scientific_name;
			res['name']['es'] = response.scientific_name;
			res['name']['fr'] = response.scientific_name;
			res['name']['ar'] = response.scientific_name;
			res['name']['ru'] = response.scientific_name;
			res['name']['zh'] = response.scientific_name;
			hasName = true;            
		}
	}
	if (response.vessel_name != undefined) {
		res['vessel_name'] = response.vessel_name;
		res['vessel_name']['en'] = response.vessel_name;
		res['vessel_name']['es'] = response.vessel_name;
		res['vessel_name']['fr'] = response.vessel_name;
		res['vessel_name']['ar'] = response.vessel_name;
		res['vessel_name']['ru'] = response.vessel_name;
		res['vessel_name']['zh'] = response.vessel_name;
		if (hasName == false) {
			res['name']['en'] = response.vessel_name;
			res['name']['es'] = response.vessel_name;
			res['name']['fr'] = response.vessel_name;
			res['name']['ar'] = response.vessel_name;
			res['name']['ru'] = response.vessel_name;
			res['name']['zh'] = response.vessel_name;
			hasName = true;            
		}
	}

	var attributes = {};
	if (response.attr != undefined) {
		for (var key in response.attr['value'][0]) {
			attributes[key] = response.attr['value'][0][key];
		}
	}

	var parents = {};
	var children = {};
	if (response.hierarchy != undefined) {
		if (response.hierarchy.parents[0].parent != undefined) {
			parents = response.hierarchy.parents[0].parent;
		}
		if (response.hierarchy.children[0].child != undefined) {
			children = response.hierarchy.children[0].child;
		}
	}

	for (var index = 0; index < parents.length; index++) {
		if (parents[index].multilingualFullName != undefined) {
			if (parents[index].multilingualFullName.EN != undefined) {
				parents[index].nameEN = parents[index].multilingualFullName.EN;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualFullName.EN;
				}
			}
			else if (parents[index].multilingualFullName.FR != undefined) {
				parents[index].nameFR = parents[index].multilingualFullName.FR;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualFullName.FR;
				}
			}
			else if (parents[index].multilingualFullName.ES != undefined) {
				parents[index].nameES = parents[index].multilingualFullName.ES;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualFullName.ES;
				}
			}
			else if (parents[index].multilingualFullName.ZH != undefined) {
				parents[index].nameZH = parents[index].multilingualFullName.ZH;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualFullName.ZH;
				}
			}
			else if (parents[index].multilingualFullName.RU != undefined) {
				parents[index].nameZH = parents[index].multilingualFullName.RU;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualFullName.RU;
				}
			}
			else if (parents[index].multilingualFullName.AR != undefined) {
				parents[index].nameZH = parents[index].multilingualFullName.AR;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualFullName.AR;
				}
			}
		} else if (parents[index].multilingualName != undefined) {
			if (parents[index].multilingualName.EN != undefined) {
				parents[index].nameEN = parents[index].multilingualName.EN;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualName.EN;
				}
			}
			else if (parents[index].multilingualName.FR != undefined) {
				parents[index].nameFR = parents[index].multilingualName.FR;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualName.FR;
				}
			}
			else if (parents[index].multilingualName.ES != undefined) {
				parents[index].nameES = parents[index].multilingualName.ES;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualName.ES;
				}
			}
			else if (parents[index].multilingualName.ZH != undefined) {
				parents[index].nameZH = parents[index].multilingualName.ZH;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualName.ZH;
				}
			}
			else if (parents[index].multilingualName.RU != undefined) {
				parents[index].nameZH = parents[index].multilingualName.RU;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualName.RU;
				}
			}
			else if (parents[index].multilingualName.AR != undefined) {
				parents[index].nameZH = parents[index].multilingualName.AR;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualName.AR;
				}
			}
		} else if (parents[index].multilingualOfficialName != undefined) {
			if (parents[index].multilingualOfficialName.EN != undefined) {
				parents[index].nameEN = parents[index].multilingualOfficialName.EN;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualOfficialName.EN;
				}
			}
			else if (parents[index].multilingualOfficialName.FR != undefined) {
				parents[index].nameFR = parents[index].multilingualOfficialName.FR;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualOfficialName.FR;
				}
			}
			else if (parents[index].multilingualOfficialName.ES != undefined) {
				parents[index].nameES = parents[index].multilingualOfficialName.ES;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualOfficialName.ES;
				}
			}
			else if (parents[index].multilingualOfficialName.ZH != undefined) {
				parents[index].nameZH = parents[index].multilingualOfficialName.ZH;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualOfficialName.ZH;
				}
			}
			else if (parents[index].multilingualOfficialName.RU != undefined) {
				parents[index].nameZH = parents[index].multilingualOfficialName.RU;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualOfficialName.RU;
				}
			}
			else if (parents[index].multilingualOfficialName.AR != undefined) {
				parents[index].nameZH = parents[index].multilingualOfficialName.AR;
				if (parents[index.name] == undefined) {
					parents[index].name = parents[index].multilingualOfficialName.AR;
				}
			}
		} else if (parents[index].scientific_name != undefined) {
			parents[index].name = parents[index].scientific_name;
		}
		parents[index].link[0].href = encodeURIComponent(Base64.encode(parents[index].link[0].href.replace(BASE_URL, "") + "!~~!" + parents[index].name));
	}
	for (var index = 0; index < children.length; index++) {
		if (children[index].multilingualFullName != undefined) {
			if (children[index].multilingualFullName.EN != undefined) {
				children[index].nameEN = children[index].multilingualFullName.EN;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualFullName.EN;
				}
			}
			else if (children[index].multilingualFullName.FR != undefined) {
				children[index].nameFR = children[index].multilingualFullName.FR;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualFullName.FR;
				}
			}
			else if (children[index].multilingualFullName.ES != undefined) {
				children[index].nameES = children[index].multilingualFullName.ES;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualFullName.ES;
				}
			}
			else if (children[index].multilingualFullName.ZH != undefined) {
				children[index].nameZH = children[index].multilingualFullName.ZH;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualFullName.ZH;
				}
			}
			else if (children[index].multilingualFullName.RU != undefined) {
				children[index].nameZH = children[index].multilingualFullName.RU;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualFullName.RU;
				}
			}
			else if (children[index].multilingualFullName.AR != undefined) {
				children[index].nameZH = children[index].multilingualFullName.AR;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualFullName.AR;
				}
			}
		} else if (children[index].multilingualName != undefined) {
			if (children[index].multilingualName.EN != undefined) {
				children[index].nameEN = children[index].multilingualName.EN;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualName.EN;
				}
			}
			else if (children[index].multilingualName.FR != undefined) {
				children[index].nameFR = children[index].multilingualName.FR;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualName.FR;
				}
			}
			else if (children[index].multilingualName.ES != undefined) {
				children[index].nameES = children[index].multilingualName.ES;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualName.ES;
				}
			}
			else if (children[index].multilingualName.ZH != undefined) {
				children[index].nameZH = children[index].multilingualName.ZH;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualName.ZH;
				}
			}
			else if (children[index].multilingualName.RU != undefined) {
				children[index].nameZH = children[index].multilingualName.RU;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualName.RU;
				}
			}
			else if (children[index].multilingualName.AR != undefined) {
				children[index].nameZH = children[index].multilingualName.AR;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualName.AR;
				}
			}
		} else if (children[index].multilingualOfficialName != undefined) {
			if (children[index].multilingualOfficialName.EN != undefined) {
				children[index].nameEN = children[index].multilingualOfficialName.EN;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualOfficialName.EN;
				}
			}
			else if (children[index].multilingualOfficialName.FR != undefined) {
				children[index].nameFR = children[index].multilingualOfficialName.FR;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualOfficialName.FR;
				}
			}
			else if (children[index].multilingualOfficialName.ES != undefined) {
				children[index].nameES = children[index].multilingualOfficialName.ES;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualOfficialName.ES;
				}
			}
			else if (children[index].multilingualOfficialName.ZH != undefined) {
				children[index].nameZH = children[index].multilingualOfficialName.ZH;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualOfficialName.ZH;
				}
			}
			else if (children[index].multilingualOfficialName.RU != undefined) {
				children[index].nameZH = children[index].multilingualOfficialName.RU;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualOfficialName.RU;
				}
			}
			else if (children[index].multilingualOfficialName.AR != undefined) {
				children[index].nameZH = children[index].multilingualOfficialName.AR;
				if (parents[index.name] == undefined) {
					children[index].name = children[index].multilingualOfficialName.AR;
				}
			}
		} else if (children[index].scientific_name != undefined) {
			children[index].name = children[index].scientific_name;
		}
		children[index].link[0].href = encodeURIComponent(Base64.encode(children[index].link[0].href.replace(BASE_URL, "") + "!~~!" + children[index].name));
	}


	arrayOfConcepts.push({"vals" : res, "attributes" : attributes, "parents" : parents, "children" : children});
	return arrayOfConcepts;
}

function amIHome(loc) {
	var splitLoc = loc.split("/");
	var last = splitLoc[splitLoc.length - 1];
	var decoded = Base64.decode(last);
	var splitDec = decoded.split("/");
	if (splitDec.length > 1) {
		return false;
	} else {
		return true;
	}
}

function parseGroup(response) {
	window['refvis']['last_response'] = response;

	for (var index=0; index<response.length; index++) {
		if (response[index]['hierarchy'] != undefined) {
			var tree={};
			var node = getNode(response[0]);
			node.hierarchy = parseHierarchy(response[0]);
			tree.node = node;
			tree.is = 'hierarchy';
			return tree;
		} else {
			return parseSubGroupList(response);
		}
		break;
	}
}

function parseHierarchy(hierarchy) {
	var list = [];
	if (hierarchy.hierarchy != undefined && hierarchy.hierarchy.children != undefined) {
		var children = hierarchy.hierarchy.children;

		for (var index = 0; index < children.length; index++) {
			var child = children[index].child[0].concept[0];
			var node = getNode(child);
			if (child.hierarchy != undefined && child.hierarchy.children != undefined) {
				var l = parseHierarchy(child);
				node.hierarchy = l;
			}
			list.push(node);
		}
	}
	return list;
}


function getNode(object) {
	var node = {};
	if (object.multilingualName != undefined) {
		var multilingualName = {};
		for ( var key in object.multilingualName ) {
			multilingualName[key] = object.multilingualName[key];
		}
		node['name'] = multilingualName;
	}
	return node;
}

function collapseExpandDiv(id, type) {
	type = (typeof type === "undefined") ? "both" : type;

	var Animatediv = $(id);
	var className = id.replace("#", "");

	if (type == "collapse") {
		slideDownDiv(Animatediv, className);
	} else if (type == "expand") {
		slideUpDiv(Animatediv, className);
	} else {
		if (Animatediv.hasClass(className)) {
			slideDownDiv(Animatediv, className);
		} else {
			slideUpDiv(Animatediv, className);
		}
	}

	var attrs = window['refvis']['menu'][className];

	var div = $("<div>").attr("class", "menu-icon").attr("id", attrs['iconid']);
	var img = $("<img>").attr("src", attrs['icon']);
	img.click(function (){
		collapseExpandDiv("#" + Animatediv.attr('id'));
	})
	var children = $(".navbar-fixed-side-left").children();
	var hasIt = false;
	children.each(function() {
	if ($(this).attr("id") == attrs['iconid']) {
		hasIt = true;
	}
	});
	if (hasIt == false) {
		$(".navbar-fixed-side-left").append(div.append(img));
	}
}

function slideUpDiv(div, className) {
	div.removeClass(className + "-collapse");
	div.addClass(className);

	resizeMainWin(true);
}

function slideDownDiv(div, className) {
	div.removeClass(className);
	div.addClass(className + "-collapse");

	resizeMainWin(false);
}

function resizeMainWin(collapse) {
	if (collapse == true) {
		if ($("#refvis-concept-result") != undefined) {
			$("#refvis-concept-result").removeClass('refvis-concept-result');
			$("#refvis-concept-result").addClass('refvis-concept-result-collapse');
		}
		if ($("#refvis-browse-results") != undefined) {
			$("#refvis-browse-results").removeClass('refvis-browse-results');
			$("#refvis-browse-results").addClass('refvis-browse-results-collapse');
		}
		if ($("#refvis-browse-groups") != undefined) {
			$("#refvis-browse-groups").removeClass('refvis-browse-groups');
			$("#refvis-browse-groups").addClass('refvis-browse-groups-collapse');
		}
	} else {
		if ($("#refvis-concept-result") != undefined) {
			$("#refvis-concept-result").removeClass('refvis-concept-result-collapse');
			$("#refvis-concept-result").addClass('refvis-concept-result');
		}
		if ($("#refvis-browse-results") != undefined) {
			$("#refvis-browse-results").removeClass('refvis-browse-results-collapse');
			$("#refvis-browse-results").addClass('refvis-browse-results');
		}
		if ($("#refvis-browse-groups") != undefined) {
			$("#refvis-browse-groups").removeClass('refvis-browse-groups-collapse');
			$("#refvis-browse-groups").addClass('refvis-browse-groups');
		}
	}
}

function toggleMainWindow(id) {
	if ($(id).hasClass("main-navigation")) {
		resizeMainWin(true);
	} else {
		resizeMainWin(false);
	}
}

function slideDownMainMenu(id, className){
	slideDownDiv($(id), className);
}

function expandCollapseMainMenu(id, className){
	var div = $(id);
	if (div.hasClass(className)) {
		slideDownDiv(div, className);
	} else {
		slideUpDiv(div, className);
	}
}

function updateMenu(which, target) {
	if (window['refvis']['menu'][which] != undefined) {
		var iconInfo = window['refvis']['menu'][which];

		var div = $("<div>").attr("class", "menu-icon").attr("id", iconInfo['iconid']);
		var img = $("<img>").attr("src", iconInfo['icon']);
		var anchor = $("<a>").attr("href", target);
		anchor.append(img);
		/*img.click(function (){
			collapseExpandDiv("#" + Animatediv.attr('id'));
		})*/
		var children = $(".navbar-fixed-side-left").children();
		var hasIt = false;
		children.each(function() {
		if ($(this).attr("id") == iconInfo['iconid']) {
			var a = $(this).find('a:first');
			a.attr('href', target);
			hasIt = true;
		}
		});
		if (hasIt == false) {
			$(".navbar-fixed-side-left").append(div.append(anchor));
		}

	}
}

function updateLatest(url, name, type) {
	if (window['refvis'] == undefined) {
		window['refvis'] = {};
		if (window['refvis']['navigation-url'] == undefined) {
			window['refvis']['navigation-url'] = [];
		}
	} else {
		if (window['refvis']['navigation-url'] == undefined) {
			window['refvis']['navigation-url'] = [];
		}
	}
	window['refvis']['navigation-url'].unshift(url);
	$("#go-back-button").attr("href", url);

	var dropdown = $("#refvis-latest-searches");
	var currentList = [];
	$('#refvis-latest-searches li').each(function(i)
	{
	   var a = $(this).find('a');
	   currentList.push({'name' : a.html(), 'url' : a.attr('href')});
	});

	dropdown.empty();

	var li = $("<li>");
	var anchor = $("<a>");
	anchor.attr('href', url);
	anchor.html('<b>' + type + ':</b> ' + name);
	li.append(anchor);
	dropdown.append(li);

	var counter=1;
	for (var index = 0; index < currentList.length; index++) {
		if (counter == 10) {
			break;
		}
		if (currentList[index].url != url) {
			var liOld = $("<li>");
			var anchorOld = $("<a>");
			anchorOld.attr('href', currentList[index].url);
			anchorOld.html(currentList[index].name);
			liOld.append(anchorOld);
			dropdown.append(liOld);
			counter++;
		}
	}
}

function goBack() {
	if (window['refvis'] != undefined && window['refvis']['navigation-url'] != undefined) {
		window['refvis']['navigation-url'].shift();
		location.href=window['refvis']['navigation-url'][0];
	}
}

function getTranslationChecker() {
	return {'en' : false, 'fr' : false, 'es' : false, 'ru': false, 'zh' : false, 'ar' : false};
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function renderGroupList(list) {
	var ul = $("<ul>").attr("id", generateUUID());
	ul.attr('id', generateUUID());
	for (var index = 0; index < list.length; index++) {
		var li = $("<li>");
		if (list[index].hierarchy != undefined) {
			var span = $("<span>")
			if (list[index].full_name_en != undefined) {
				span.text(list[index].full_name_en);
			} else if (list[index].long_name_en != undefined) {
				span.text(list[index].long_name_en);
			} else if (list[index].official_name_en != undefined) {
				span.text(list[index].official_name_en);
			} else if (list[index].name_en != undefined) {
				span.text(list[index].name_en);
			}
			span.addClass("refvis-object-item-slidable")
			li.append(span);
			li.addClass("parent");
			li.append(renderGroupList(list[index].hierarchy));
		} else {
			var a = $("<a>")
			var name = "";
			if (list[index].full_name_en != undefined) {
				a.text(list[index].full_name_en);
				name = list[index].full_name_en;
			} else if (list[index].long_name_en != undefined) {
				a.text(list[index].long_name_en);
				name = list[index].long_name_en;
			} else if (list[index].official_name_en != undefined) {
				a.text(list[index].official_name_en);
				name = list[index].official_name_en;
			} else if (list[index].name_en != undefined) {
				a.text(list[index].name_en);
				name = list[index].name_en;
			}
			a.addClass("refvis-object-item-clickable");
			var toLink = list[index].link;
			try {
				a.attr("href", "concept/" + Base64.encode(toLink.replace(BASE_URL, "") + "!~~!" + name));
			} catch(err) {
				a.attr("href", "javascript:void(0);");
			}
			li.append(a);
		}

		
		ul.append(li);
	}
	return ul;
}

function swapStyles(cssFile, cssLinkIndex) {
	var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

$(function() {
    $("#refvis-fulltext-bar").focus(function() {
    	/*$("#sidebar").effect( "size", {
		    to: { width: 200, height: 60 }
		  }, 1000 );*/

    });
    $("#refvis-fulltext-bar").blur(function() {
    	$("#sidebar").removeClass("sidebar-glow");
    });
});