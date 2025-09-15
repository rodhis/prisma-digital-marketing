-- DropForeignKey
ALTER TABLE "public"."LeadCampaign" DROP CONSTRAINT "LeadCampaign_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LeadCampaign" DROP CONSTRAINT "LeadCampaign_leadId_fkey";

-- AddForeignKey
ALTER TABLE "public"."LeadCampaign" ADD CONSTRAINT "LeadCampaign_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadCampaign" ADD CONSTRAINT "LeadCampaign_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
