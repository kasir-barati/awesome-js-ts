import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

export const AuditLogSchema = new Schema(
  {},
  { collection: 'audit_logs', discriminatorKey: 'eventType', timestamps: true },
);

export type AuditLog = InferSchemaType<typeof AuditLogSchema>;
export type AuditLogDoc = HydratedDocument<AuditLog>;

export const AuditLogModel = model<AuditLog>('AuditLog', AuditLogSchema);

const AuditLogCreateSchema = new Schema({
  payload: { type: Schema.Types.Mixed, required: true },
});

const AuditLogUpdateSchema = new Schema({
  after: { type: Schema.Types.Mixed, required: true },
  before: { type: Schema.Types.Mixed, required: true },
});

const AuditLogDeleteSchema = new Schema({
  payload: { type: Schema.Types.Mixed, required: true },
});

export type AuditLogCreate = InferSchemaType<typeof AuditLogCreateSchema>;
export type AuditLogUpdate = InferSchemaType<typeof AuditLogUpdateSchema>;
export type AuditLogDelete = InferSchemaType<typeof AuditLogDeleteSchema>;

export const AuditLogCreateModel = AuditLogModel.discriminator<AuditLogCreate>(
  'AuditLogCreate',
  AuditLogCreateSchema,
  'create',
);

export const AuditLogUpdateModel = AuditLogModel.discriminator<AuditLogUpdate>(
  'AuditLogUpdate',
  AuditLogUpdateSchema,
  'update',
);

export const AuditLogDeleteModel = AuditLogModel.discriminator<AuditLogDelete>(
  'AuditLogDelete',
  AuditLogDeleteSchema,
  'delete',
);
