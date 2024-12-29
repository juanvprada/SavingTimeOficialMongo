import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  try {
    // Add images column
    await queryInterface.addColumn('posts', 'images', {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    });

    // Migrate existing image data to images array
    const [posts] = await queryInterface.sequelize.query(
      'SELECT id, image FROM posts WHERE image IS NOT NULL;'
    );

    for (const post of posts as any[]) {
      if (post.image) {
        await queryInterface.sequelize.query(
          'UPDATE posts SET images = :images WHERE id = :id',
          {
            replacements: {
              id: post.id,
              images: JSON.stringify([post.image])
            }
          }
        );
      }
    }

    // Optionally remove the old image column
    // Uncomment this line if you want to remove the old column
    // await queryInterface.removeColumn('posts', 'image');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  try {
    // Remove the images column
    await queryInterface.removeColumn('posts', 'images');

    // If you removed the image column in up(), add it back here
    // await queryInterface.addColumn('posts', 'image', {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // });
  } catch (error) {
    console.error('Migration rollback failed:', error);
    throw error;
  }
};