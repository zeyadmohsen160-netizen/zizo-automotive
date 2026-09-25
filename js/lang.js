const translations = {

    en: {

        navHome: "Home",
        navCars: "Cars",
        navSell: "Sell Your Car",
        navContact: "Contact",
        browseCars: "Browse Cars",

        heroSmall: "ZIZO AUTOMOTIVE",

        heroTitle1: "Find the right car.",

        heroTitle2: "Deal with confidence.",

        heroText:
            "Zizo Automotive connects serious buyers with trusted sellers while we handle the inspection, evaluation and deal.",

        browse: "Browse Cars",

        sell: "Sell Your Car",

        howItWorks: "HOW IT WORKS",

        buyingSimple:
            "Buying a car made simpler.",

        howText:
            "We help you find the car, inspect it and connect you with the seller.",

        step1Title:
            "Find a Car",

        step1Text:
            "Browse available vehicles and check their specifications, mileage, price and license details.",

        step2Title:
            "Request Inspection",

        step2Text:
            "If you are interested in a car, contact Zizo Automotive and we arrange the next step.",

        step3Title:
            "Inspect & Deal",

        step3Text:
            "We inspect the vehicle and help connect the buyer and seller to move forward with confidence.",

        interested:
            "INTERESTED IN A CAR?",

        interestedTitle:
            "We inspect it before you move forward.",

        interestedText:
            "Choose a car and contact Zizo Automotive. We arrange the inspection and help you move forward with confidence.",

        sellQuestion:
            "HAVE A CAR TO SELL?",

        sellTitle:
            "Let us help you find a serious buyer.",

        footerDescription:
            "Car brokerage, inspection and vehicle sales.",

        quickLinks:
            "Quick Links",

        footerContact:
            "Contact",

        egypt:
            "Egypt"
    },


    ar: {

        navHome:
            "الرئيسية",

        navCars:
            "السيارات",

        navSell:
            "اعرض عربيتك",

        navContact:
            "تواصل معنا",

        browseCars:
            "تصفح السيارات",


        heroSmall:
            "زيزو أوتوموتيف",

        heroTitle1:
            "اختار العربية المناسبة.",

        heroTitle2:
            "إحنا نفحصها.. وانت تقرر.",

        heroText:
            "زيزو أوتوموتيف وسيط سيارات بيربط المشترين الجادين بأصحاب السيارات، مع فحص ومعاينة وتقييم العربية قبل إتمام الصفقة.",

        browse:
            "تصفح السيارات",

        sell:
            "اعرض عربيتك",


        howItWorks:
            "إزاي بنشتغل",

        buyingSimple:
            "شراء العربية أصبح أسهل.",

        howText:
            "بنساعِدك تختار العربية، نفحصها ونعمل المعاينة، وننسق التواصل بينك وبين صاحب العربية.",


        step1Title:
            "اختار العربية",

        step1Text:
            "تصفح السيارات المعروضة وشوف المواصفات، الكيلومترات، السعر وبيانات الرخصة.",


        step2Title:
            "اطلب المعاينة",

        step2Text:
            "لو عجبتك عربية، تواصل مع Zizo Automotive وإحنا نرتب الخطوة التالية.",


        step3Title:
            "نفحص ونتفاوض",

        step3Text:
            "ننزل نفحص العربية ونعمل المعاينة ونساعدك تكمل الصفقة بثقة.",


        interested:
            "مهتم بعربية؟",

        interestedTitle:
            "إحنا نفحصها قبل ما تاخد قرار.",

        interestedText:
            "اختار العربية اللي عجبتك وتواصل مع Zizo Automotive. إحنا نرتب المعاينة ونساعدك في الخطوة التالية.",


        sellQuestion:
            "عندك عربية للبيع؟",

        sellTitle:
            "خلينا نساعدك تلاقي مشتري جاد.",


        footerDescription:
            "وساطة سيارات، فحص ومعاينة وبيع السيارات.",

        quickLinks:
            "روابط سريعة",

        footerContact:
            "تواصل معنا",

        egypt:
            "مصر"
    }

};


function applyLanguage(language) {

    const selectedLanguage =
        translations[language]
            ? language
            : "en";


    /*
       الاتجاه بيتحط على الصفحة كلها فقط.
       مش على كل عنصر.
    */

    document.documentElement.lang =
        selectedLanguage;

    document.documentElement.dir =
        selectedLanguage === "ar"
            ? "rtl"
            : "ltr";


    document.body.dir =
        selectedLanguage === "ar"
            ? "rtl"
            : "ltr";


    /*
       تغيير النصوص
    */

    document.querySelectorAll("[data-key]")
        .forEach(element => {

            const key =
                element.getAttribute("data-key");

            if (
                translations[selectedLanguage][key]
            ) {

                element.textContent =
                    translations[selectedLanguage][key];

            }

        });


    /*
       تحديث شكل أزرار اللغة
    */

    document.querySelectorAll("[data-lang]")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.getAttribute("data-lang")
                === selectedLanguage
            );

        });


    /*
       حفظ اللغة
    */

    localStorage.setItem(
        "zizoLanguage",
        selectedLanguage
    );

}


/*
   تشغيل الصفحة
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const savedLanguage =
            localStorage.getItem("zizoLanguage")
            || "en";


        applyLanguage(savedLanguage);


        /*
           أزرار AR / EN
        */

        document
            .querySelectorAll("[data-lang]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const language =
                            this.getAttribute("data-lang");

                        applyLanguage(language);

                    }
                );

            });

    }
);