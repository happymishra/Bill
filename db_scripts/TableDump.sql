BEGIN TRANSACTION;
CREATE TEMPORARY TABLE t1_backup(BillNo,Source, Destination, Amount,
						DocketCharges, DocketNumber, CompanyName, CompanyAddress, GSTIN,
						ShipmentDate, BillSubmissionDate,VehicleNumber, IsPaymentDone, Quantity);
INSERT INTO t1_backup SELECT BillNo,Source, Destination, Amount,
						DocketCharges, DocketNumber, CompanyName, CompanyAddress, GSTIN,
						ShipmentDate, BillSubmissionDate,VehicleNumber, IsPaymentDone, Quantity
						FROM bill_detail;
DROP TABLE bill_detail;
CREATE TABLE bill_detail(BillNo,Source, Destination, Amount,
						DocketCharges, DocketNumber, CompanyName, CompanyAddress, GSTIN,
						ShipmentDate, BillSubmissionDate,VehicleNumber, IsPaymentDone, Quantity);
INSERT INTO bill_detail SELECT BillNo,Source, Destination, Amount,
						DocketCharges, DocketNumber, CompanyName, CompanyAddress, GSTIN,
						ShipmentDate, BillSubmissionDate,VehicleNumber, IsPaymentDone, Quantity
						FROM t1_backup;
DROP TABLE t1_backup;
COMMIT;

ALTER TABLE bill_detail ADD COLUMN extras TEXT;