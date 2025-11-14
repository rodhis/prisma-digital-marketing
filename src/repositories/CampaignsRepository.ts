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

export interface CampaignsRepository {
    find: () => Promise<CampaignModel[]>
    findById: (id: number) => Promise<CampaignModel | null>
    create: (attributes: CreateCampaignAttributes) => Promise<CampaignModel>
    updateById: (id: number, attributes: Partial<CreateCampaignAttributes>) => Promise<CampaignModel | null>
    deleteById: (id: number) => Promise<CampaignModel | null>
}
