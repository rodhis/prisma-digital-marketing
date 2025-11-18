export type LeadCampaignStatus =
    | 'NEW'
    | 'ENGAGED'
    | 'FOLLOWUP_SCHEDULED'
    | 'CONTACTED'
    | 'CONVERTED'
    | 'UNRESPONSIVE'
    | 'DISQUALIFIED'
    | 'RE_ENGAGED'
    | 'OPTED_OUT'

export interface CampaignModel {
    id: number
    name: string
    description: string
}

export interface CreateCampaignAttributes {
    name: string
    description: string
    startDate: Date
    endDate?: Date
}

export interface AddLeadToCampaignAttributes {
    campaignId: number
    leadId: number
    status: LeadCampaignStatus
}

export interface LeadCampaignAssociation {
    leadId: number
    campaignId: number
    status: LeadCampaignStatus
}

export interface CampaignsRepository {
    find: () => Promise<CampaignModel[]>
    findById: (id: number) => Promise<CampaignModel | null>
    create: (attributes: CreateCampaignAttributes) => Promise<CampaignModel>
    updateById: (id: number, attributes: Partial<CreateCampaignAttributes>) => Promise<CampaignModel | null>
    deleteById: (id: number) => Promise<CampaignModel | null>
    findLeadCampaignAssociation: (
        campaignId: number,
        leadId: number
    ) => Promise<LeadCampaignAssociation | null>
    addLead: (attributes: AddLeadToCampaignAttributes) => Promise<void>
    updateLeadStatus: (attributes: AddLeadToCampaignAttributes) => Promise<LeadCampaignAssociation>
    removeLead: (campaignId: number, leadId: number) => Promise<LeadCampaignAssociation>
}
