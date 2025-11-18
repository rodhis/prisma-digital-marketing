import prisma from '../../database/index.js'
import type {
    AddLeadToCampaignAttributes,
    CampaignModel,
    CampaignsRepository,
    CreateCampaignAttributes,
    LeadCampaignAssociation,
} from '../CampaignsRepository.js'

export class PrismaCampaignsRepository implements CampaignsRepository {
    find(): Promise<CampaignModel[]> {
        return prisma.campaign.findMany()
    }
    findById(id: number): Promise<CampaignModel | null> {
        return prisma.campaign.findUnique({
            where: { id },
            include: {
                leads: {
                    include: {
                        lead: true,
                    },
                },
            },
        })
    }
    create(attributes: CreateCampaignAttributes): Promise<CampaignModel> {
        return prisma.campaign.create({ data: attributes })
    }
    async updateById(
        id: number,
        attributes: Partial<CreateCampaignAttributes>
    ): Promise<CampaignModel | null> {
        const campaignExists = await prisma.campaign.findUnique({ where: { id } })
        if (!campaignExists) return null

        return prisma.campaign.update({
            where: { id },
            data: attributes,
        })
    }
    async deleteById(id: number): Promise<CampaignModel | null> {
        const campaignExists = await prisma.campaign.findUnique({ where: { id } })
        if (!campaignExists) return null

        return prisma.campaign.delete({ where: { id } })
    }

    async findLeadCampaignAssociation(
        campaignId: number,
        leadId: number
    ): Promise<LeadCampaignAssociation | null> {
        return prisma.leadCampaign.findUnique({
            where: {
                leadId_campaignId: {
                    leadId,
                    campaignId,
                },
            },
        })
    }

    async addLead(attributes: AddLeadToCampaignAttributes): Promise<void> {
        await prisma.leadCampaign.create({ data: attributes })
    }

    async updateLeadStatus(attributes: AddLeadToCampaignAttributes): Promise<LeadCampaignAssociation> {
        return prisma.leadCampaign.update({
            data: { status: attributes.status },
            where: {
                leadId_campaignId: {
                    leadId: attributes.leadId,
                    campaignId: attributes.campaignId,
                },
            },
        })
    }

    async removeLead(campaignId: number, leadId: number): Promise<LeadCampaignAssociation> {
        return prisma.leadCampaign.delete({
            where: {
                leadId_campaignId: {
                    leadId,
                    campaignId,
                },
            },
        })
    }
}
