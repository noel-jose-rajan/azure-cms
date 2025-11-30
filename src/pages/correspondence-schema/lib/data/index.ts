export const schemaTypeList = [{
    "name": "pk.segment_Inbound",
    "key": "Inbound",
    "display_text": "External Inbound",
},
{
    "name": "pk.segment_Outbound",
    "key": "Outbound",
    "display_text": "External Outbound",
},
{
    "name": "pk.segment_Internal",
    "key": "Internal",
    "display_text": "Internal Correspondences",
},
{
    "name": "pk.segment_InternalAnnouncement",
    "key": "InternalAnnouncement",
    "display_text": "Internal Correspondences (Announcement)",
},
{
    "name": "pk.segment_InternalDecision",
    "key": "InternalDecision",
    "display_text": "Internal Correspondences (Decision)",
},
{
    "name": "pk.segment_InternalMeeting",
    "key": "InternalMeeting",
    "display_text": "Internal Correspondences (Meeting)",
}
];

export const segmentsTypeList = {
    "corr.type.en": {
        "segmentEnType": "Correspondence Type English Label",
        "segmentArType": "الاسم الاجنبي لنوع المراسلة"
    },
    "corr.type.ar": {
        "segmentEnType": "Correspondence Type Arabic Label",
        "segmentArType": "الاسم العربي لتوع المراسلة"
    },
    "corr.type.abb": {
        "segmentEnType": "Correspondence Type Abbreviation",
        "segmentArType": "الاسم المختصر لنوع المراسلة"
    },
    "doc.type.en": {
        "segmentEnType": "Document Type English Label",
        "segmentArType": "الاسم الاجنبي لنوع المستند"
    },
    "doc.type.ar": {
        "segmentEnType": "Document Type Arabic Label",
        "segmentArType": "الاسم العربي لنوع المستند"
    },
    "doc.type.abb": {
        "segmentEnType": "Document Type Abbreviation",
        "segmentArType": "الاسم المختصر لنوع المستند"
    },
    "ext.reference.no": {
        "segmentEnType": "External Reference Number",
        "segmentArType": "الرقم المرجعي الخارجي"
    },
    "fixed": {
        "segmentEnType": "Fixed Value",
        "segmentArType": "قيمة ثابتة"
    },
    "se.orgunit.en.desc": {
        "segmentEnType": "Sending Organization Unit English Description",
        "segmentArType": "الاسم الاجنبي للجهة الداخلية المراسلة"
    },
    "se.orgunit.ar.desc": {
        "segmentEnType": "Sending Organization Unit Arabic Description",
        "segmentArType": "الاسم العربي للجهة الداخلية المرسلة"
    },
    "se.orgunit.code": {
        "segmentEnType": "Sending Organization Unit Code",
        "segmentArType": "الرقم التعريفي للجهة الداخلية المرسلة"
    },
    "se.orgunit.hierarchy": {
        "segmentEnType": "Sending Organization Unit Hierarchy",
        "segmentArType": "تسلسل الجهة الداخلية المرسلة"
    },
    "receive.orgunit.en.desc": {
        "segmentEnType": "Receiving Organization Unit English Description",
        "segmentArType": "الاسم الاجنبي للجهة الداخلية المستقبلة"
    },
    "receive.orgunit.ar.desc": {
        "segmentEnType": "Receiving Organization Unit Arabic Description",
        "segmentArType": "الاسم العربي للجهةالداخلية المستقبلة"
    },
    "receive.orgunit.code": {
        "segmentEnType": "Receiving Organization Unit Code",
        "segmentArType": "الرقم التعريفي للجهة الداخلية المستقبلة"
    },
    "receive.orgunit.hierarchy": {
        "segmentEnType": "Receiving Organization Unit Hierarchy",
        "segmentArType": "تسلسل الجهة الداخلية المستقبلة"
    },
    "se.external.en.desc": {
        "segmentEnType": "Sending External Entity English Description",
        "segmentArType": "الاسم الاجنبي للجهة الخارجية المرسلة"
    },
    "se.external.ar.desc": {
        "segmentEnType": "Sending External Entity Arabic Description",
        "segmentArType": "الاسم العربي للجهة الخارجية المرسلة"
    },
    "se.external.short": {
        "segmentEnType": "Sending External Entity Short Number",
        "segmentArType": "الاسم المختصر للجهة الخارجية المرسلة"
    },
    "receive.external.en.desc": {
        "segmentEnType": "Receiving External Entity English Description",
        "segmentArType": "الاسم الاجنبي للجهة الخارجية المستقبلة"
    },
    "receive.external.ar.desc": {
        "segmentEnType": "Receiving External Entity Arabic Description",
        "segmentArType": "الاسم العربي للجهة الخارجية المستقبلة"
    },
    "receive.external.short": {
        "segmentEnType": "Receiving External Entity Short Number",
        "segmentArType": "الاسم المختصر للجهة الخارجية المستقبلة"
    },
    "sequence.no": {
        "segmentEnType": "Sequence Number",
        "segmentArType": "الرقم التسلسلي"
    },
    "year.four": {
        "segmentEnType": "Year (yyyy)",
        "segmentArType": "السنة (yyyy)"
    },
    "year.two": {
        "segmentEnType": "Year (yy)",
        "segmentArType": "السنة (yy)"
    },
    "month.two": {
        "segmentEnType": "Month (mm)",
        "segmentArType": "الشهر (mm)"
    },
    "day.two": {
        "segmentEnType": "Day (dd)",
        "segmentArType": "اليوم (dd)"
    },
    "receive.orgunit.abbreviation": {
        "segmentEnType": "Abbreviation receiving Org unit",
        "segmentArType": "مختصر الوحدة التنظيمية المستقبلة"
    },
    "approve.orgunit.abbreviation": {
        "segmentEnType": "Abbreviation approved Org unit",
        "segmentArType": "مختصر الوحدة التنظيمية الموافقة"
    },
    "se.orgunit.abbreviation": {
        "segmentEnType": "Abbreviation sending Org unit",
        "segmentArType": "مختصر الوحدة التنظيمية المرسلة"
    }
};


export const getSegmentTypeList = (schemaType?: string) => {

    let segmentTypeList;

    switch (schemaType) {


        case 'Inbound':
            segmentTypeList = [{
                "segmentEnType": "Correspondence Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المراسلة",
                "segmentKey": "corr.type.en"
            },
            {
                "segmentEnType": "Correspondence Type Arabic Label",
                "segmentArType": "الاسم العربي لتوع المراسلة",
                "segmentKey": "corr.type.ar"
            },
            {
                "segmentEnType": "Correspondence Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المراسلة",
                "segmentKey": "corr.type.abb"
            },
            {
                "segmentEnType": "Document Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المستند",
                "segmentKey": "doc.type.en"
            },
            {
                "segmentEnType": "Document Type Arabic Label",
                "segmentArType": "الاسم العربي لنوع المستند",
                "segmentKey": "doc.type.ar"
            },
            {
                "segmentEnType": "Document Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المستند",
                "segmentKey": "doc.type.abb"
            },
            {
                "segmentEnType": "External Reference Number",
                "segmentArType": "الرقم المرجعي الخارجي",
                "segmentKey": "ext.reference.no"
            },
            {
                "segmentEnType": "Fixed Value",
                "segmentArType": "قيمة ثابتة",
                "segmentKey": "fixed"
            },
            {
                "segmentEnType": "Receiving Organization Unit English Description",
                "segmentArType": "الاسم الاجنبي للجهة الداخلية المستقبلة",
                "segmentKey": "receive.orgunit.en.desc"
            },
            {
                "segmentEnType": "Receiving Organization Unit Arabic Description",
                "segmentArType": "الاسم العربي للجهةالداخلية المستقبلة",
                "segmentKey": "receive.orgunit.ar.desc"
            },
            {
                "segmentEnType": "Receiving Organization Unit Code",
                "segmentArType": "الرقم التعريفي للجهة الداخلية المستقبلة",
                "segmentKey": "receive.orgunit.code"
            },
            {
                "segmentEnType": "Receiving Organization Unit Hierarchy",
                "segmentArType": "تسلسل الجهة الداخلية المستقبلة",
                "segmentKey": "receive.orgunit.hierarchy"
            },
            {
                "segmentEnType": "Sending External Entity English Description",
                "segmentArType": "الاسم الاجنبي للجهة الخارجية المرسلة",
                "segmentKey": "se.external.en.desc"
            },
            {
                "segmentEnType": "Sending External Entity Arabic Description",
                "segmentArType": "الاسم العربي للجهة الخارجية المرسلة",
                "segmentKey": "se.external.ar.desc"
            },
            {
                "segmentEnType": "Sending External Entity Short Number",
                "segmentArType": "الاسم المختصر للجهة الخارجية المرسلة",
                "segmentKey": "se.external.short"
            },
            {
                "segmentEnType": "Sequence Number",
                "segmentArType": "الرقم التسلسلي",
                "segmentKey": "sequence.no"
            },
            {
                "segmentEnType": "Year (yyyy)",
                "segmentArType": "السنة (yyyy)",
                "segmentKey": "year.four"
            },
            {
                "segmentEnType": "Year (yy)",
                "segmentArType": "السنة (yy)",
                "segmentKey": "year.two"
            },

            {
                "segmentEnType": "Month (mm)",
                "segmentArType": "الشهر (mm)",
                "segmentKey": "month.two"
            },
            {
                "segmentEnType": "Abbreviation receiving Org unit",
                "segmentArType": "مختصر الوحدة التنظيمية المستقبلة",
                "segmentKey": "receive.orgunit.abbreviation"
            }
                /*,
                                {
                                    "segmentEnType": "Day (dd)",
                                    "segmentArType": "Day (dd)",
                                    "segmentKey": "day.two"
                                }*/
            ];
            break;

        case 'Outbound':
            segmentTypeList = [{
                "segmentEnType": "Correspondence Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المراسلة",
                "segmentKey": "corr.type.en"
            },
            {
                "segmentEnType": "Correspondence Type Arabic Label",
                "segmentArType": "الاسم العربي لتوع المراسلة",
                "segmentKey": "corr.type.ar"
            },
            {
                "segmentEnType": "Correspondence Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المراسلة",
                "segmentKey": "corr.type.abb"
            },
            {
                "segmentEnType": "Document Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المستند",
                "segmentKey": "doc.type.en"
            },
            {
                "segmentEnType": "Document Type Arabic Label",
                "segmentArType": "الاسم العربي لنوع المستند",
                "segmentKey": "doc.type.ar"
            },
            {
                "segmentEnType": "Document Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المستند",
                "segmentKey": "doc.type.abb"
            },
            {
                "segmentEnType": "External Reference Number",
                "segmentArType": "الرقم المرجعي الخارجي",
                "segmentKey": "ext.reference.no"
            },
            {
                "segmentEnType": "Fixed Value",
                "segmentArType": "قيمة ثابتة",
                "segmentKey": "fixed"
            },
            {
                "segmentEnType": "Approving Organization Unit English Description",
                "segmentArType": "الاسم الاجنبي للجهة الداخلية الموافقة",
                "segmentKey": "approve.orgunit.en.desc"
            },
            {
                "segmentEnType": "Approving Organization Unit Arabic Description",
                "segmentArType": "الاسم العربي للجهة الداخلية الموافقة",
                "segmentKey": "approve.orgunit.ar.desc"
            },
            {
                "segmentEnType": "Approving Organization Unit Code",
                "segmentArType": "الرقم التعريفي للجهة الداخلية الموافقة",
                "segmentKey": "approve.orgunit.code"
            },
            {
                "segmentEnType": "Sending Organization Unit English Description",
                "segmentArType": "الاسم الاجنبي للجهة الداخلية المراسلة",
                "segmentKey": "se.orgunit.en.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Arabic Description",
                "segmentArType": "الاسم العربي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.ar.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Code",
                "segmentArType": "الرقم التعريفي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.code"
            },
            {
                "segmentEnType": "Sending Organization Unit Hierarchy",
                "segmentArType": "تسلسل الجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.hierarchy"
            },
            {
                "segmentEnType": "Receiving External Entity English Description",
                "segmentArType": "الاسم الاجنبي للجهة الخارجية المستقبلة",
                "segmentKey": "se.external.en.desc"
            },
            {
                "segmentEnType": "Receiving External Entity Arabic Description",
                "segmentArType": "الاسم العربي للجهة الخارجية المستقبلة",
                "segmentKey": "se.external.ar.desc"
            },
            {
                "segmentEnType": "Receiving External Entity Short Number",
                "segmentArType": "الاسم المختصر للجهة الخارجية المستقبلة",
                "segmentKey": "se.external.short"
            },
            {
                "segmentEnType": "Sequence Number",
                "segmentArType": "الرقم التسلسلي",
                "segmentKey": "sequence.no"
            },
            {
                "segmentEnType": "Year (yyyy)",
                "segmentArType": "السنة (yyyy)",
                "segmentKey": "year.four"
            },
            {
                "segmentEnType": "Year (yy)",
                "segmentArType": "السنة (yy)",
                "segmentKey": "year.two"
            },

            {
                "segmentEnType": "Month (mm)",
                "segmentArType": "الشهر (mm)",
                "segmentKey": "month.two"
            },
            {
                "segmentEnType": "Abbreviation receiving Org unit",
                "segmentArType": "مختصر الوحدة التنظيمية المرسلة",
                "segmentKey": "se.orgunit.abbreviation"
            },
            {
                "segmentEnType": "Abbreviation approved Org unit",
                "segmentArType": "مختصر الوحدة التنظيمية الموافقة",
                "segmentKey": "approve.orgunit.abbreviation"
            }
                /*,
                                {
                                    "segmentEnType": "Day (dd)",
                                    "segmentArType": "Day (dd)",
                                    "segmentKey": "day.two"
                                }*/
            ];
            break;

        case 'Internal':
            segmentTypeList = [{
                "segmentEnType": "Correspondence Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المراسلة",
                "segmentKey": "corr.type.en"
            },
            {
                "segmentEnType": "Correspondence Type Arabic Label",
                "segmentArType": "الاسم العربي لتوع المراسلة",
                "segmentKey": "corr.type.ar"
            },
            {
                "segmentEnType": "Correspondence Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المراسلة",
                "segmentKey": "corr.type.abb"
            },
            {
                "segmentEnType": "Document Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المستند",
                "segmentKey": "doc.type.en"
            },
            {
                "segmentEnType": "Document Type Arabic Label",
                "segmentArType": "الاسم العربي لنوع المستند",
                "segmentKey": "doc.type.ar"
            },
            {
                "segmentEnType": "Document Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المستند",
                "segmentKey": "doc.type.abb"
            },
            {
                "segmentEnType": "External Reference Number",
                "segmentArType": "الرقم المرجعي الخارجي",
                "segmentKey": "ext.reference.no"
            },
            {
                "segmentEnType": "Fixed Value",
                "segmentArType": "قيمة ثابتة",
                "segmentKey": "fixed"
            },
            {
                "segmentEnType": "Approving Organization Unit English Description",
                "segmentArType": "الاسم الاجنبي للجهة الداخلية الموافقة",
                "segmentKey": "approve.orgunit.en.desc"
            },
            {
                "segmentEnType": "Approving Organization Unit Arabic Description",
                "segmentArType": "الاسم العربي للجهة الداخلية الموافقة",
                "segmentKey": "approve.orgunit.ar.desc"
            },
            {
                "segmentEnType": "Approving Organization Unit Code",
                "segmentArType": "الرقم التعريفي للجهة الداخلية الموافقة",
                "segmentKey": "approve.orgunit.code"
            },
            {
                "segmentEnType": "Sending Organization Unit English Description",
                "segmentArType": "الاسم الاجنبي للجهة الداخلية المراسلة",
                "segmentKey": "se.orgunit.en.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Arabic Description",
                "segmentArType": "الاسم العربي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.ar.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Code",
                "segmentArType": "الرقم التعريفي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.code"
            },
            {
                "segmentEnType": "Sending Organization Unit Hierarchy",
                "segmentArType": "تسلسل الجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.hierarchy"
            },
            {
                "segmentEnType": "Receiving Organization Unit English Description",
                "segmentArType": "الاسم الاجنبي للجهة الداخلية المستقبلة",
                "segmentKey": "receive.orgunit.en.desc"
            },
            {
                "segmentEnType": "Receiving Organization Unit Arabic Description",
                "segmentArType": "الاسم العربي للجهةالداخلية المستقبلة",
                "segmentKey": "receive.orgunit.ar.desc"
            },
            {
                "segmentEnType": "Receiving Organization Unit Code",
                "segmentArType": "الرقم التعريفي للجهة الداخلية المستقبلة",
                "segmentKey": "receive.orgunit.code"
            },
            {
                "segmentEnType": "Receiving Organization Unit Hierarchy",
                "segmentArType": "تسلسل الجهة الداخلية المستقبلة",
                "segmentKey": "receive.orgunit.hierarchy"
            },
            {
                "segmentEnType": "Sequence Number",
                "segmentArType": "الرقم التسلسلي",
                "segmentKey": "sequence.no"
            },
            {
                "segmentEnType": "Year (yyyy)",
                "segmentArType": "السنة (yyyy)",
                "segmentKey": "year.four"
            },
            {
                "segmentEnType": "Year (yy)",
                "segmentArType": "السنة (yy)",
                "segmentKey": "year.two"
            },
            {
                "segmentEnType": "Month (mm)",
                "segmentArType": "الشهر (mm)",
                "segmentKey": "month.two"
            },
            {
                "segmentEnType": "Abbreviation sending Org unit",
                "segmentArType": "مختصر الوحدة التنظيمية المرسلة",
                "segmentKey": "se.orgunit.abbreviation"
            },
            {
                "segmentEnType": "Abbreviation receiving Org unit",
                "segmentArType": "مختصر الوحدة التنظيمية المستقبلة",
                "segmentKey": "receive.orgunit.abbreviation"
            },
            {
                "segmentEnType": "Abbreviation approved Org unit",
                "segmentArType": "مختصر الوحدة التنظيمية الموافقة",
                "segmentKey": "approve.orgunit.abbreviation"
            }

                /*,
                                {
                                    "segmentEnType": "Day (dd)",
                                    "segmentArType": "Day (dd)",
                                    "segmentKey": "day.two"
                                }*/
            ];
            break;

        case 'InternalAnnouncement':
            segmentTypeList = [{
                "segmentEnType": "Correspondence Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المراسلة",
                "segmentKey": "corr.type.en"
            },
            {
                "segmentEnType": "Correspondence Type Arabic Label",
                "segmentArType": "Correspondence Type Arabic Label",
                "segmentKey": "corr.type.ar"
            },
            {
                "segmentEnType": "Correspondence Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المراسلة",
                "segmentKey": "corr.type.abb"
            },
            {
                "segmentEnType": "Document Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المستند",
                "segmentKey": "doc.type.en"
            },
            {
                "segmentEnType": "Document Type Arabic Label",
                "segmentArType": "الاسم العربي لنوع المستند",
                "segmentKey": "doc.type.ar"
            },
            {
                "segmentEnType": "Document Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المستند",
                "segmentKey": "doc.type.abb"
            },
            {
                "segmentEnType": "External Reference Number",
                "segmentArType": "الرقم المرجعي الخارجي",
                "segmentKey": "ext.reference.no"
            },
            {
                "segmentEnType": "Fixed Value",
                "segmentArType": "قيمة ثابتة",
                "segmentKey": "fixed"
            },
            {
                "segmentEnType": "Sending Organization Unit English Description",
                "segmentArType": "الاسم الاجنبي للجهة الداخلية المراسلة",
                "segmentKey": "se.orgunit.en.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Arabic Description",
                "segmentArType": "الاسم العربي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.ar.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Code",
                "segmentArType": "الرقم التعريفي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.code"
            },
            {
                "segmentEnType": "Sequence Number",
                "segmentArType": "الرقم التسلسلي",
                "segmentKey": "sequence.no"
            },
            {
                "segmentEnType": "Year (yyyy)",
                "segmentArType": "السنة (yyyy)",
                "segmentKey": "year.four"
            },
            {
                "segmentEnType": "Year (yy)",
                "segmentArType": "السنة (yy)",
                "segmentKey": "year.two"
            },
            {
                "segmentEnType": "Month (mm)",
                "segmentArType": "الشهر (mm)",
                "segmentKey": "month.two"
            }
                /*,
                                {
                                    "segmentEnType": "Day (dd)",
                                    "segmentArType": "Day (dd)",
                                    "segmentKey": "day.two"
                                }*/
            ];
            break;

        case 'InternalDecision':
            segmentTypeList = [{
                "segmentEnType": "Correspondence Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المراسلة",
                "segmentKey": "corr.type.en"
            },
            {
                "segmentEnType": "Correspondence Type Arabic Label",
                "segmentArType": "Correspondence Type Arabic Label",
                "segmentKey": "corr.type.ar"
            },
            {
                "segmentEnType": "Correspondence Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المراسلة",
                "segmentKey": "corr.type.abb"
            },
            {
                "segmentEnType": "Document Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المستند",
                "segmentKey": "doc.type.en"
            },
            {
                "segmentEnType": "Document Type Arabic Label",
                "segmentArType": "الاسم العربي لنوع المستند",
                "segmentKey": "doc.type.ar"
            },
            {
                "segmentEnType": "Document Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المستند",
                "segmentKey": "doc.type.abb"
            },
            {
                "segmentEnType": "External Reference Number",
                "segmentArType": "الرقم المرجعي الخارجي",
                "segmentKey": "ext.reference.no"
            },
            {
                "segmentEnType": "Fixed Value",
                "segmentArType": "قيمة ثابتة",
                "segmentKey": "fixed"
            },
            {
                "segmentEnType": "Sending Organization Unit English Description",
                "segmentArType": "الاسم الاجنبي للجهة الداخلية المراسلة",
                "segmentKey": "se.orgunit.en.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Arabic Description",
                "segmentArType": "الاسم العربي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.ar.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Code",
                "segmentArType": "الرقم التعريفي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.code"
            },
            {
                "segmentEnType": "Sequence Number",
                "segmentArType": "الرقم التسلسلي",
                "segmentKey": "sequence.no"
            },
            {
                "segmentEnType": "Year (yyyy)",
                "segmentArType": "السنة (yyyy)",
                "segmentKey": "year.four"
            },
            {
                "segmentEnType": "Year (yy)",
                "segmentArType": "السنة (yy)",
                "segmentKey": "year.two"
            },
            {
                "segmentEnType": "Month (mm)",
                "segmentArType": "الشهر (mm)",
                "segmentKey": "month.two"
            }
                /*,
                                {
                                    "segmentEnType": "Day (dd)",
                                    "segmentArType": "Day (dd)",
                                    "segmentKey": "day.two"
                                }*/
            ];
            break;

        case 'InternalMeeting':
            segmentTypeList = [{
                "segmentEnType": "Correspondence Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المراسلة",
                "segmentKey": "corr.type.en"
            },
            {
                "segmentEnType": "Correspondence Type Arabic Label",
                "segmentArType": "Correspondence Type Arabic Label",
                "segmentKey": "corr.type.ar"
            },
            {
                "segmentEnType": "Correspondence Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المراسلة",
                "segmentKey": "corr.type.abb"
            },
            {
                "segmentEnType": "Document Type English Label",
                "segmentArType": "الاسم الاجنبي لنوع المستند",
                "segmentKey": "doc.type.en"
            },
            {
                "segmentEnType": "Document Type Arabic Label",
                "segmentArType": "الاسم العربي لنوع المستند",
                "segmentKey": "doc.type.ar"
            },
            {
                "segmentEnType": "Document Type Abbreviation",
                "segmentArType": "الاسم المختصر لنوع المستند",
                "segmentKey": "doc.type.abb"
            },
            {
                "segmentEnType": "External Reference Number",
                "segmentArType": "الرقم المرجعي الخارجي",
                "segmentKey": "ext.reference.no"
            },
            {
                "segmentEnType": "Fixed Value",
                "segmentArType": "قيمة ثابتة",
                "segmentKey": "fixed"
            },
            {
                "segmentEnType": "Sending Organization Unit English Description",
                "segmentArType": "الاسم الاجنبي للجهة الداخلية المراسلة",
                "segmentKey": "se.orgunit.en.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Arabic Description",
                "segmentArType": "الاسم العربي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.ar.desc"
            },
            {
                "segmentEnType": "Sending Organization Unit Code",
                "segmentArType": "الرقم التعريفي للجهة الداخلية المرسلة",
                "segmentKey": "se.orgunit.code"
            },
            {
                "segmentEnType": "Sequence Number",
                "segmentArType": "الرقم التسلسلي",
                "segmentKey": "sequence.no"
            },
            {
                "segmentEnType": "Year (yyyy)",
                "segmentArType": "السنة (yyyy)",
                "segmentKey": "year.four"
            },
            {
                "segmentEnType": "Year (yy)",
                "segmentArType": "السنة (yy)",
                "segmentKey": "year.two"
            },
            {
                "segmentEnType": "Month (mm)",
                "segmentArType": "الشهر (mm)",
                "segmentKey": "month.two"
            }
                /*,
                                {
                                    "segmentEnType": "Day (dd)",
                                    "segmentArType": "Day (dd)",
                                    "segmentKey": "day.two"
                                }*/
            ];
            break;
    }

    return segmentTypeList
}