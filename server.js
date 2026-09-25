const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

/* =========================================================
   PATHS
========================================================= */

const websiteFolder = __dirname;

const imagesFolder = path.join(
    websiteFolder,
    "images"
);

const databasePath = path.join(
    websiteFolder,
    "database.db"
);

/* =========================================================
   CREATE IMAGES FOLDER
========================================================= */

if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder, {
        recursive: true
    });
}

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

/*
 * Serve the whole website
 * including HTML / CSS / JS / images
 */
app.use(
    express.static(websiteFolder)
);

/* =========================================================
   DATABASE
========================================================= */

const db = new sqlite3.Database(
    databasePath,
    (error) => {

        if (error) {

            console.error(
                "Database connection error:",
                error.message
            );

        } else {

            console.log(
                "Database connected successfully."
            );

        }

    }
);

/* =========================================================
   FOREIGN KEYS
========================================================= */

db.run(
    "PRAGMA foreign_keys = ON",
    (error) => {

        if (error) {

            console.error(
                "Foreign keys error:",
                error.message
            );

        }

    }
);

/* =========================================================
   DATABASE TABLES
========================================================= */

db.serialize(() => {

    /* =====================================================
       CARS
    ===================================================== */

    db.run(`
        CREATE TABLE IF NOT EXISTS cars (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            brand TEXT NOT NULL,

            model TEXT NOT NULL,

            year INTEGER NOT NULL,

            mileage INTEGER,

            price INTEGER,

            transmission TEXT,

            condition TEXT,

            traffic_department TEXT,

            license_remaining TEXT,

            description TEXT,

            seller_name TEXT NOT NULL,

            seller_phone TEXT NOT NULL,

            car_location TEXT NOT NULL,

            status TEXT DEFAULT 'available',

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


    /* =====================================================
       CAR IMAGES
    ===================================================== */

    db.run(`
        CREATE TABLE IF NOT EXISTS car_images (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            car_id INTEGER NOT NULL,

            image_path TEXT NOT NULL,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (car_id)
                REFERENCES cars(id)
                ON DELETE CASCADE

        )
    `);


    /* =====================================================
       INSPECTION REQUESTS
    ===================================================== */

    db.run(`
        CREATE TABLE IF NOT EXISTS inspection_requests (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            car_id INTEGER NOT NULL,

            buyer_name TEXT NOT NULL,

            buyer_phone TEXT NOT NULL,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (car_id)
                REFERENCES cars(id)
                ON DELETE CASCADE

        )
    `);

});

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {

        cb(
            null,
            imagesFolder
        );

    },

    filename: function (
        req,
        file,
        cb
    ) {

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();

        const uniqueName =
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 12);

        cb(
            null,
            uniqueName + extension
        );

    }

});

/* =========================================================
   MULTER UPLOAD
========================================================= */

const upload = multer({

    storage: storage,

    limits: {

        /*
         * Maximum image size:
         * 10 MB
         */

        fileSize:
            10 * 1024 * 1024,

        /*
         * Maximum images
         * per car = 20
         */

        files: 20

    },

    fileFilter: function (
        req,
        file,
        cb
    ) {

        const allowedTypes = [

            "image/jpeg",

            "image/jpg",

            "image/png",

            "image/webp"

        ];

        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                )
            );

        }

    }

});

/* =========================================================
   HOME
========================================================= */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                websiteFolder,
                "index.html"
            )
        );

    }
);

/* =========================================================
   PUBLIC - ALL CARS
========================================================= */

app.get(
    "/api/cars",
    (req, res) => {

        db.all(
            `
            SELECT

                id,

                brand,

                model,

                year,

                mileage,

                price,

                transmission,

                condition,

                traffic_department,

                license_remaining,

                description,

                status,

                created_at

            FROM cars

            WHERE status = 'available'

            ORDER BY id DESC
            `,
            [],
            (error, cars) => {

                if (error) {

                    console.error(
                        "Load cars error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load cars."

                    });

                }

                if (
                    !cars ||
                    cars.length === 0
                ) {

                    return res.json({

                        success: true,

                        cars: []

                    });

                }

                let completed = 0;

                const carsWithImages = [];


                /* =================================================
                   LOAD ALL IMAGES FOR EACH CAR
                ================================================= */

                cars.forEach(
                    (car) => {

                        db.all(
                            `
                            SELECT

                                id,

                                image_path

                            FROM car_images

                            WHERE car_id = ?

                            ORDER BY id ASC
                            `,
                            [car.id],
                            (
                                imageError,
                                images
                            ) => {

                                if (imageError) {

                                    console.error(
                                        "Load images error:",
                                        imageError.message
                                    );

                                    return res.status(500).json({

                                        success: false,

                                        message:
                                            "Could not load car images."

                                    });

                                }


                                /*
                                 * Return all images
                                 * as simple paths
                                 */

                                car.images =
                                    (images || []).map(
                                        image =>
                                            image.image_path
                                    );


                                /*
                                 * First image is
                                 * the main image
                                 */

                                car.main_image =
                                    car.images.length > 0
                                        ? car.images[0]
                                        : null;


                                carsWithImages.push(
                                    car
                                );

                                completed++;


                                /*
                                 * When all cars
                                 * are completed
                                 */

                                if (
                                    completed ===
                                    cars.length
                                ) {

                                    carsWithImages.sort(
                                        (a, b) =>
                                            b.id - a.id
                                    );


                                    return res.json({

                                        success: true,

                                        cars:
                                            carsWithImages

                                    });

                                }

                            }
                        );

                    }
                );

            }
        );

    }
);

/* =========================================================
   PUBLIC - ONE CAR
========================================================= */

app.get(
    "/api/cars/:id",
    (req, res) => {

        const carId =
            Number(
                req.params.id
            );


        if (
            !Number.isInteger(carId) ||
            carId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid car ID."

            });

        }


        db.get(
            `
            SELECT

                id,

                brand,

                model,

                year,

                mileage,

                price,

                transmission,

                condition,

                traffic_department,

                license_remaining,

                description,

                status,

                created_at

            FROM cars

            WHERE id = ?
            `,
            [carId],
            (
                error,
                car
            ) => {

                if (error) {

                    console.error(
                        "Get car error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Database error."

                    });

                }


                if (!car) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Car not found."

                    });

                }


                /*
                 * Load ALL images
                 */

                db.all(
                    `
                    SELECT

                        id,

                        image_path

                    FROM car_images

                    WHERE car_id = ?

                    ORDER BY id ASC
                    `,
                    [carId],
                    (
                        imageError,
                        images
                    ) => {

                        if (imageError) {

                            console.error(
                                "Get car images error:",
                                imageError.message
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Could not load car images."

                            });

                        }


                        car.images =
                            (images || []).map(
                                image =>
                                    image.image_path
                            );


                        car.main_image =
                            car.images.length > 0
                                ? car.images[0]
                                : null;


                        return res.json({

                            success: true,

                            car: car

                        });

                    }
                );

            }
        );

    }
);

/* =========================================================
   ADD CAR
========================================================= */

app.post(
    "/api/cars",
    upload.array(
        "images",
        20
    ),
    (req, res) => {

        const {

            brand,

            model,

            year,

            mileage,

            price,

            transmission,

            condition,

            traffic_department,

            license_remaining,

            description,

            seller_name,

            seller_phone,

            car_location

        } = req.body;


        /* =====================================================
           REQUIRED FIELDS
        ===================================================== */

        if (
            !brand ||
            !model ||
            !year ||
            !seller_name ||
            !seller_phone ||
            !car_location
        ) {

            deleteUploadedFiles(
                req.files
            );

            return res.status(400).json({

                success: false,

                message:
                    "Please complete all required fields."

            });

        }


        /* =====================================================
           VALIDATE YEAR
        ===================================================== */

        const carYear =
            Number(year);


        if (
            !Number.isInteger(carYear) ||
            carYear < 1900 ||
            carYear >
                new Date().getFullYear() + 2
        ) {

            deleteUploadedFiles(
                req.files
            );

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid car year."

            });

        }


        /* =====================================================
           FILES
        ===================================================== */

        const files =
            req.files || [];


        if (
            files.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please upload at least one car image."

            });

        }


        /* =====================================================
           INSERT CAR
        ===================================================== */

        const sql = `
            INSERT INTO cars (

                brand,

                model,

                year,

                mileage,

                price,

                transmission,

                condition,

                traffic_department,

                license_remaining,

                description,

                seller_name,

                seller_phone,

                car_location

            )

            VALUES (

                ?,

                ?,

                ?,

                ?,

                ?,

                ?,

                ?,

                ?,

                ?,

                ?,

                ?,

                ?,

                ?

            )
        `;


        const values = [

            brand.trim(),

            model.trim(),

            carYear,

            mileage
                ? Number(mileage)
                : null,

            price
                ? Number(price)
                : null,

            transmission ||
                null,

            condition ||
                null,

            traffic_department ||
                null,

            license_remaining ||
                null,

            description
                ? description.trim()
                : null,

            seller_name.trim(),

            seller_phone.trim(),

            car_location.trim()

        ];


        db.run(
            sql,
            values,
            function (error) {

                if (error) {

                    console.error(
                        "Insert car error:",
                        error.message
                    );

                    deleteUploadedFiles(
                        files
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not save the car."

                    });

                }


                const carId =
                    this.lastID;


                /*
                 * Save ALL uploaded images
                 */

                insertImages(
                    carId,
                    files,
                    0,
                    res
                );

            }
        );

    }
);

/* =========================================================
   INSERT ALL IMAGES
========================================================= */

function insertImages(
    carId,
    files,
    index,
    res
) {

    /*
     * Finished
     */

    if (
        index >=
        files.length
    ) {

        return res.json({

            success: true,

            carId:
                carId,

            imagesCount:
                files.length,

            message:
                "Car added successfully."

        });

    }


    const file =
        files[index];


    const imagePath =
        "/images/" +
        file.filename;


    db.run(
        `
        INSERT INTO car_images (

            car_id,

            image_path

        )

        VALUES (?, ?)
        `,
        [
            carId,

            imagePath

        ],
        (error) => {

            if (error) {

                console.error(
                    "Save image error:",
                    error.message
                );


                /*
                 * Delete car.
                 * Because foreign keys are ON,
                 * related image rows are removed.
                 */

                db.run(
                    `
                    DELETE FROM cars

                    WHERE id = ?
                    `,
                    [carId],
                    () => {

                        deleteUploadedFiles(
                            files
                        );


                        if (
                            !res.headersSent
                        ) {

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Could not save car images."

                            });

                        }

                    }
                );

                return;

            }


            /*
             * Save next image
             */

            insertImages(
                carId,
                files,
                index + 1,
                res
            );

        }
    );

}

/* =========================================================
   DELETE UPLOADED FILES
========================================================= */

function deleteUploadedFiles(
    files
) {

    if (
        !files ||
        files.length === 0
    ) {

        return;

    }


    files.forEach(
        file => {

            if (
                !file ||
                !file.filename
            ) {

                return;

            }


            const filePath =
                path.join(
                    imagesFolder,
                    file.filename
                );


            if (
                fs.existsSync(
                    filePath
                )
            ) {

                try {

                    fs.unlinkSync(
                        filePath
                    );

                }
                catch (error) {

                    console.error(
                        "Delete uploaded file error:",
                        error.message
                    );

                }

            }

        }
    );

}

/* =========================================================
   INSPECTION REQUEST
========================================================= */

app.post(
    "/api/inspection",
    (req, res) => {

        const {

            car_id,

            buyer_name,

            buyer_phone

        } = req.body;


        if (
            !car_id ||
            !buyer_name ||
            !buyer_phone
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please complete all fields."

            });

        }


        const carId =
            Number(car_id);


        if (
            !Number.isInteger(carId) ||
            carId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid car ID."

            });

        }


        db.get(
            `
            SELECT id

            FROM cars

            WHERE id = ?
            `,
            [carId],
            (
                carError,
                car
            ) => {

                if (carError) {

                    return res.status(500).json({

                        success: false,

                        message:
                            "Database error."

                    });

                }


                if (!car) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Car not found."

                    });

                }


                db.run(
                    `
                    INSERT INTO inspection_requests (

                        car_id,

                        buyer_name,

                        buyer_phone

                    )

                    VALUES (?, ?, ?)
                    `,
                    [

                        carId,

                        buyer_name.trim(),

                        buyer_phone.trim()

                    ],
                    function (error) {

                        if (error) {

                            console.error(
                                "Inspection request error:",
                                error.message
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Could not send request."

                            });

                        }


                        return res.json({

                            success: true,

                            requestId:
                                this.lastID,

                            message:
                                "Inspection request sent."

                        });

                    }
                );

            }
        );

    }
);

/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

function adminAuthentication(
    req,
    res,
    next
) {

    const password =
        req.headers[
            "x-admin-password"
        ];


    if (!password) {

        return res.status(401).json({

            success: false,

            message:
                "Admin password required."

        });

    }


    if (
        password !==
        "Zizo@2026"
    ) {

        return res.status(401).json({

            success: false,

            message:
                "Wrong admin password."

        });

    }


    next();

}

/* =========================================================
   ADMIN - ALL CARS
========================================================= */

app.get(
    "/api/admin/cars",
    adminAuthentication,
    (req, res) => {

        db.all(
            `
            SELECT *

            FROM cars

            ORDER BY id DESC
            `,
            [],
            (
                error,
                cars
            ) => {

                if (error) {

                    console.error(
                        "Admin cars error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load admin cars."

                    });

                }


                if (
                    !cars ||
                    cars.length === 0
                ) {

                    return res.json({

                        success: true,

                        cars: []

                    });

                }


                let completed = 0;

                const result = [];


                cars.forEach(
                    car => {

                        db.all(
                            `
                            SELECT

                                id,

                                image_path

                            FROM car_images

                            WHERE car_id = ?

                            ORDER BY id ASC
                            `,
                            [car.id],
                            (
                                imageError,
                                images
                            ) => {

                                if (imageError) {

                                    console.error(
                                        "Admin images error:",
                                        imageError.message
                                    );

                                    return res.status(500).json({

                                        success: false,

                                        message:
                                            "Could not load admin images."

                                    });

                                }


                                /*
                                 * Admin receives
                                 * every image
                                 */

                                car.images =
                                    (
                                        images ||
                                        []
                                    ).map(
                                        image => ({

                                            id:
                                                image.id,

                                            image_path:
                                                image.image_path

                                        })
                                    );


                                /*
                                 * Main image
                                 */

                                car.main_image =
                                    car.images.length > 0
                                        ? car.images[0].image_path
                                        : null;


                                result.push(
                                    car
                                );

                                completed++;


                                if (
                                    completed ===
                                    cars.length
                                ) {

                                    result.sort(
                                        (a, b) =>
                                            b.id - a.id
                                    );


                                    return res.json({

                                        success: true,

                                        cars:
                                            result

                                    });

                                }

                            }
                        );

                    }
                );

            }
        );

    }
);

/* =========================================================
   ADMIN - INSPECTION REQUESTS
========================================================= */

app.get(
    "/api/admin/requests",
    adminAuthentication,
    (req, res) => {

        db.all(
            `
            SELECT

                inspection_requests.id,

                inspection_requests.car_id,

                inspection_requests.buyer_name,

                inspection_requests.buyer_phone,

                inspection_requests.created_at,

                cars.brand,

                cars.model,

                cars.year,

                cars.seller_name,

                cars.seller_phone,

                cars.car_location

            FROM inspection_requests

            LEFT JOIN cars

            ON inspection_requests.car_id =
               cars.id

            ORDER BY
                inspection_requests.id DESC
            `,
            [],
            (
                error,
                requests
            ) => {

                if (error) {

                    console.error(
                        "Load requests error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load requests."

                    });

                }


                return res.json({

                    success: true,

                    requests:
                        requests || []

                });

            }
        );

    }
);

/* =========================================================
   ADMIN - DELETE CAR
========================================================= */

app.delete(
    "/api/admin/cars/:id",
    adminAuthentication,
    (req, res) => {

        const carId =
            Number(
                req.params.id
            );


        if (
            !Number.isInteger(carId) ||
            carId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid car ID."

            });

        }


        /*
         * Get all image paths
         * BEFORE deleting the car
         */

        db.all(
            `
            SELECT image_path

            FROM car_images

            WHERE car_id = ?
            `,
            [carId],
            (
                imageError,
                images
            ) => {

                if (imageError) {

                    console.error(
                        "Load delete images error:",
                        imageError.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load images."

                    });

                }


                /*
                 * Check car exists
                 */

                db.get(
                    `
                    SELECT id

                    FROM cars

                    WHERE id = ?
                    `,
                    [carId],
                    (
                        carError,
                        car
                    ) => {

                        if (carError) {

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Database error."

                            });

                        }


                        if (!car) {

                            return res.status(404).json({

                                success: false,

                                message:
                                    "Car not found."

                            });

                        }


                        /*
                         * Delete car
                         */

                        db.run(
                            `
                            DELETE FROM cars

                            WHERE id = ?
                            `,
                            [carId],
                            function (
                                deleteError
                            ) {

                                if (
                                    deleteError
                                ) {

                                    console.error(
                                        "Delete car error:",
                                        deleteError.message
                                    );

                                    return res.status(500).json({

                                        success: false,

                                        message:
                                            "Could not delete the car."

                                    });

                                }


                                /*
                                 * Delete ALL
                                 * image files
                                 */

                                (
                                    images ||
                                    []
                                ).forEach(
                                    image => {

                                        if (
                                            !image.image_path
                                        ) {

                                            return;

                                        }


                                        const filename =
                                            path.basename(
                                                image.image_path
                                            );


                                        const fullPath =
                                            path.join(
                                                imagesFolder,
                                                filename
                                            );


                                        if (
                                            fs.existsSync(
                                                fullPath
                                            )
                                        ) {

                                            try {

                                                fs.unlinkSync(
                                                    fullPath
                                                );

                                            }
                                            catch (
                                                deleteImageError
                                            ) {

                                                console.error(
                                                    "Image delete error:",
                                                    deleteImageError.message
                                                );

                                            }

                                        }

                                    }
                                );


                                return res.json({

                                    success: true,

                                    message:
                                        "Car and all images deleted successfully."

                                });

                            }
                        );

                    }
                );

            }
        );

    }
);

/* =========================================================
   ADMIN - DELETE INSPECTION REQUEST
========================================================= */

app.delete(
    "/api/admin/requests/:id",
    adminAuthentication,
    (req, res) => {

        const requestId =
            Number(
                req.params.id
            );


        if (
            !Number.isInteger(requestId) ||
            requestId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid request ID."

            });

        }


        db.run(
            `
            DELETE FROM inspection_requests

            WHERE id = ?
            `,
            [requestId],
            function (error) {

                if (error) {

                    console.error(
                        "Delete request error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not delete request."

                    });

                }


                if (
                    this.changes === 0
                ) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Request not found."

                    });

                }


                return res.json({

                    success: true,

                    message:
                        "Request deleted successfully."

                });

            }
        );

    }
);

/* =========================================================
   404 API HANDLER
========================================================= */

app.use(
    "/api",
    (req, res) => {

        return res.status(404).json({

            success: false,

            message:
                "API endpoint not found."

        });

    }
);

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Server error:",
            error.message
        );


        /* =====================================================
           MULTER ERROR
        ===================================================== */

        if (
            error instanceof
            multer.MulterError
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Image upload error: " +
                    error.message

            });

        }


        /* =====================================================
           NORMAL ERROR
        ===================================================== */

        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.message

            });

        }


        next();

    }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "===================================="
        );

        console.log(
            "          ZIZO AUTOMOTIVE"
        );

        console.log(
            "===================================="
        );

        console.log(
            "Server running on:"
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            "===================================="
        );

        console.log("");

    }
);