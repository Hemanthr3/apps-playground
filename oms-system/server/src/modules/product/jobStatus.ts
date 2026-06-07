import type { Request, Response } from "express";
import { Job } from "bullmq";
import { productImportQueue } from "../../lib/queue";

const getJobStatus = async (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  

  const job = await Job.fromId(productImportQueue, jobId);

  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  const state = await job.getState();

  return res.status(200).json({
    success: true,
    jobId,
    state,
    progress: job.progress,
    result: state === "completed" ? job.returnvalue : null,
    error: state === "failed" ? job.failedReason : null,
  });
};

export default getJobStatus;
