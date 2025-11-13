export interface GroupModel {
    id: number
    name: string
    description: string
}

export interface CreateGroupAttributes {
    name: string
    description: string
}

export interface GroupsRepository {
    find: () => Promise<GroupModel[]>
    findById: (id: number) => Promise<GroupModel | null>
    create: (attributes: CreateGroupAttributes) => Promise<GroupModel>
    updateById: (id: number, attributes: Partial<CreateGroupAttributes>) => Promise<GroupModel | null>
    deleteById: (id: number) => Promise<GroupModel | null>
}
