import fs from "fs";

const errorHandler = (err, req, res, next) => {
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.error("Gagal hapus file:", unlinkErr);
    });
  }

  res.status(err.status || 500).json({
    status: err.dataStatus || "Failed",
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};

export default errorHandler;
